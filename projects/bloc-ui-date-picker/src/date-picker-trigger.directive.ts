import {
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  Renderer2,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BlocCalendarPanelComponent } from './calendar-panel.component';

// ── Injected styles ────────────────────────────────────────────────────────

const TRIGGER_CSS = [
  '.bloc-dp-trigger-dropdown{',
  'position:fixed;z-index:var(--bloc-date-picker-z-index,100);',
  'min-width:280px;border-width:1px;border-style:solid;',
  'border-color:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db));',
  'border-radius:var(--bloc-date-picker-dropdown-radius,8px);',
  'padding:12px;box-sizing:border-box;',
  'font-family:inherit;',
  'animation:bloc-dp-trigger-in .15s ease}',
  ':where(.bloc-dp-trigger-dropdown){',
  'background-color:var(--bloc-date-picker-dropdown-bg,#ffffff);',
  'box-shadow:var(--bloc-date-picker-dropdown-shadow,0 4px 16px rgba(0,0,0,.1))}',
  // Arrow — outer
  '.bloc-dp-trigger-dropdown::before,',
  '.bloc-dp-trigger-dropdown::after{content:"";position:absolute;width:0;height:0}',
  '.bloc-dp-trigger-dropdown::before{',
  'top:-8px;left:16px;border:8px solid transparent;border-top:none;',
  'border-bottom-color:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db))}',
  // Arrow — inner
  '.bloc-dp-trigger-dropdown::after{',
  'top:-7px;left:17px;border:7px solid transparent;border-top:none;',
  'border-bottom-color:var(--bloc-date-picker-dropdown-bg,#ffffff)}',
  // Upward variant
  '.bloc-dp-trigger-dropdown--upward{animation-name:bloc-dp-trigger-in-up}',
  '.bloc-dp-trigger-dropdown--upward::before{',
  'top:auto;bottom:-8px;left:16px;border:8px solid transparent;border-bottom:none;',
  'border-top-color:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db))}',
  '.bloc-dp-trigger-dropdown--upward::after{',
  'top:auto;bottom:-7px;left:17px;border:7px solid transparent;border-bottom:none;',
  'border-top-color:var(--bloc-date-picker-dropdown-bg,#ffffff)}',
  '@keyframes bloc-dp-trigger-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes bloc-dp-trigger-in-up{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}',
  // Disabled state
  '.bloc-date-picker-trigger--disabled{opacity:0.5;cursor:not-allowed;pointer-events:none}',
].join('');

function ensureStyles(doc: Document): void {
  if (!doc?.head || doc.getElementById('bloc-dp-trigger-styles')) return;
  const style = doc.createElement('style');
  style.id = 'bloc-dp-trigger-styles';
  style.textContent = TRIGGER_CSS;
  doc.head.appendChild(style);
}

// ── Directive ──────────────────────────────────────────────────────────────

@Directive({
  selector: '[blocDatePickerTrigger]',
  standalone: true,
  exportAs: 'blocDatePickerTrigger',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BlocDatePickerTriggerDirective),
      multi: true,
    },
  ],
  host: {
    '(click)': 'toggle()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'isOpen()',
    '[class.bloc-date-picker-trigger--open]': 'isOpen()',
    '[class.bloc-date-picker-trigger--disabled]': 'isDisabled()',
    '[attr.disabled]': 'isDisabled() || null',
  },
})
export class BlocDatePickerTriggerDirective implements ControlValueAccessor, OnInit {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _doc = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);

  /** Minimum selectable date. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly maxDate = input<Date | null>(null);

  /** Date format string for `displayValue`. Defaults to `'yyyy-MM-dd'`. */
  readonly format = input<string>('yyyy-MM-dd');

  /** Disable the trigger via template binding. */
  readonly disabled = input<boolean>(false);

  /** Currently selected date. */
  readonly _selectedDate = signal<Date | null>(null);

  /** Whether the calendar panel is open. */
  readonly isOpen = signal<boolean>(false);

  private readonly _formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  /** Formatted display value consumers can bind in their trigger template. */
  readonly displayValue = computed(() => {
    const d = this._selectedDate();
    if (!d) return '';
    return this._formatDate(d);
  });

  private _onChange: (val: Date | null) => void = () => { };
  private _onTouched: () => void = () => { };

  private _panelRef: ComponentRef<BlocCalendarPanelComponent> | null = null;
  private _wrapper: HTMLElement | null = null;
  private _docClickUnlisten: (() => void) | null = null;
  private _escUnlisten: (() => void) | null = null;

  constructor() {
    ensureStyles(this._doc);
  }

  ngOnInit(): void {
    this._destroyRef.onDestroy(() => this._close());
  }

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen() ? this._close() : this._open();
  }

  // ── ControlValueAccessor ────────────────────────────────────────────────

  writeValue(val: unknown): void {
    this._selectedDate.set(val instanceof Date ? val : val ? new Date(val as string) : null);
  }

  registerOnChange(fn: (val: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private _open(): void {
    if (this._panelRef) return;

    // Create panel via ViewContainerRef (keeps it in Angular's change-detection tree)
    this._panelRef = this._vcr.createComponent(BlocCalendarPanelComponent);
    const panel = this._panelRef.instance;

    // Set inputs
    this._panelRef.setInput('selectedDate', this._selectedDate());
    this._panelRef.setInput('minDate', this.minDate());
    this._panelRef.setInput('maxDate', this.maxDate());

    // Listen to outputs
    panel.dateSelect.subscribe((date: Date) => {
      this._selectedDate.set(date);
      this._onChange(date);
      this._close();
    });
    panel.cleared.subscribe(() => {
      this._selectedDate.set(null);
      this._onChange(null);
    });

    panel.resetView(this._selectedDate());

    // Create wrapper div and append component's host element into it
    this._wrapper = this._doc.createElement('div');
    this._wrapper.className = 'bloc-dp-trigger-dropdown';
    this._wrapper.setAttribute('role', 'dialog');
    this._wrapper.setAttribute('aria-label', 'Date picker');
    this._wrapper.appendChild(this._panelRef.location.nativeElement);
    this._doc.body.appendChild(this._wrapper);

    // Position
    this._positionDropdown();

    this.isOpen.set(true);
    this._onTouched();

    // Close on outside click (delay so current click doesn't immediately close)
    requestAnimationFrame(() => {
      this._docClickUnlisten = this._renderer.listen('document', 'click', (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          !this._el.nativeElement.contains(target) &&
          !this._wrapper?.contains(target)
        ) {
          this._close();
        }
      });

      this._escUnlisten = this._renderer.listen('document', 'keydown.escape', () => {
        this._close();
      });
    });
  }

  private _close(): void {
    this._docClickUnlisten?.();
    this._docClickUnlisten = null;
    this._escUnlisten?.();
    this._escUnlisten = null;

    if (this._panelRef) {
      this._panelRef.destroy();
      this._panelRef = null;
    }

    if (this._wrapper) {
      this._wrapper.remove();
      this._wrapper = null;
    }

    this.isOpen.set(false);
  }

  private _positionDropdown(): void {
    if (!this._wrapper) return;
    const rect = this._el.nativeElement.getBoundingClientRect();
    const openUpward = window.innerHeight - rect.bottom < 320;

    if (openUpward) {
      this._wrapper.classList.add('bloc-dp-trigger-dropdown--upward');
      this._wrapper.style.left = `${rect.left}px`;
      this._wrapper.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      this._wrapper.style.top = 'auto';
    } else {
      this._wrapper.classList.remove('bloc-dp-trigger-dropdown--upward');
      this._wrapper.style.left = `${rect.left}px`;
      this._wrapper.style.top = `${rect.bottom + 10}px`;
      this._wrapper.style.bottom = 'auto';
    }
  }

  private _formatDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return this.format()
      .replace('yyyy', String(yyyy))
      .replace('MM', mm)
      .replace('dd', dd);
  }
}
