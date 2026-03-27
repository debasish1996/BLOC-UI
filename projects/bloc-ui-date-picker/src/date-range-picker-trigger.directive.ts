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
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BlocCalendarPanelComponent } from './calendar-panel.component';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

// ── Injected styles (reuses the same dropdown CSS id as the single trigger) ──

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
  '.bloc-dp-trigger-dropdown::before,',
  '.bloc-dp-trigger-dropdown::after{content:"";position:absolute;width:0;height:0}',
  '.bloc-dp-trigger-dropdown::before{',
  'top:-8px;left:16px;border:8px solid transparent;border-top:none;',
  'border-bottom-color:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db))}',
  '.bloc-dp-trigger-dropdown::after{',
  'top:-7px;left:17px;border:7px solid transparent;border-top:none;',
  'border-bottom-color:var(--bloc-date-picker-dropdown-bg,#ffffff)}',
  '.bloc-dp-trigger-dropdown--upward{animation-name:bloc-dp-trigger-in-up}',
  '.bloc-dp-trigger-dropdown--upward::before{',
  'top:auto;bottom:-8px;left:16px;border:8px solid transparent;border-bottom:none;',
  'border-top-color:var(--bloc-date-picker-dropdown-border,var(--bloc-border,#d1d5db))}',
  '.bloc-dp-trigger-dropdown--upward::after{',
  'top:auto;bottom:-7px;left:17px;border:7px solid transparent;border-bottom:none;',
  'border-top-color:var(--bloc-date-picker-dropdown-bg,#ffffff)}',
  '@keyframes bloc-dp-trigger-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes bloc-dp-trigger-in-up{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}',
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
  selector: '[blocDateRangePickerTrigger]',
  standalone: true,
  exportAs: 'blocDateRangePickerTrigger',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BlocDateRangePickerTriggerDirective),
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
export class BlocDateRangePickerTriggerDirective implements ControlValueAccessor, OnInit {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _doc = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);

  /** Minimum selectable date. */
  readonly minDate = input<Date | null>(null);

  /** Maximum selectable date. */
  readonly maxDate = input<Date | null>(null);

  /** Disable the trigger via template binding. */
  readonly disabled = input<boolean>(false);

  /** Optional FormGroup with `from` and `to` controls. When provided, the directive patches these controls directly. */
  readonly rangeFormGroup = input<FormGroup | null>(null);

  // ── Internal state ──────────────────────────────────────────────────────

  readonly rangeStart = signal<Date | null>(null);
  readonly rangeEnd = signal<Date | null>(null);
  readonly _hoverDate = signal<Date | null>(null);
  readonly _pickState = signal<'idle' | 'picking'>('idle');

  readonly isOpen = signal<boolean>(false);

  private readonly _formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

  private _onChange: (val: DateRange) => void = () => { };
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
    if (val && typeof val === 'object' && ('from' in val || 'to' in val)) {
      const v = val as Partial<DateRange>;
      this.rangeStart.set(this._toDate(v.from));
      this.rangeEnd.set(this._toDate(v.to));
    } else {
      this.rangeStart.set(null);
      this.rangeEnd.set(null);
    }
    this._pickState.set('idle');
  }

  registerOnChange(fn: (val: DateRange) => void): void {
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

    this._panelRef = this._vcr.createComponent(BlocCalendarPanelComponent);
    const panel = this._panelRef.instance;

    // Set inputs — range mode
    this._panelRef.setInput('mode', 'range');
    this._panelRef.setInput('rangeStart', this.rangeStart());
    this._panelRef.setInput('rangeEnd', this.rangeEnd());
    this._panelRef.setInput('hoverDate', null);
    this._panelRef.setInput('minDate', this.minDate());
    this._panelRef.setInput('maxDate', this.maxDate());

    // Listen to outputs
    panel.dateSelect.subscribe((date: Date) => this._handleDateSelect(date));
    panel.dateHover.subscribe((date: Date) => this._handleDateHover(date));
    panel.cleared.subscribe(() => this._handleClear());

    // Reset view to show the range start month, or current month
    panel.resetView(this.rangeStart());

    // Create wrapper
    this._wrapper = this._doc.createElement('div');
    this._wrapper.className = 'bloc-dp-trigger-dropdown';
    this._wrapper.setAttribute('role', 'dialog');
    this._wrapper.setAttribute('aria-label', 'Date range picker');

    // Forward CSS custom properties from the trigger so tokens cascade into the panel
    const triggerStyle = this._el.nativeElement.style as CSSStyleDeclaration;
    Array.from(triggerStyle).forEach(prop => {
      if (prop.startsWith('--')) {
        this._wrapper!.style.setProperty(prop, triggerStyle.getPropertyValue(prop));
      }
    });

    this._wrapper.appendChild(this._panelRef.location.nativeElement);
    this._doc.body.appendChild(this._wrapper);

    this._positionDropdown();
    this.isOpen.set(true);
    this._onTouched();

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

  private _handleDateSelect(date: Date): void {
    if (this._pickState() === 'idle') {
      // First click — set anchor
      this.rangeStart.set(date);
      this.rangeEnd.set(null);
      this._hoverDate.set(null);
      this._pickState.set('picking');

      // Update panel inputs
      this._panelRef?.setInput('rangeStart', date);
      this._panelRef?.setInput('rangeEnd', null);
      this._panelRef?.setInput('hoverDate', null);
    } else {
      // Second click — complete range
      const anchor = this.rangeStart()!;
      const [from, to] = anchor <= date ? [anchor, date] : [date, anchor];

      this.rangeStart.set(from);
      this.rangeEnd.set(to);
      this._hoverDate.set(null);
      this._pickState.set('idle');

      this._emitValue({ from, to });
      this._close();
    }
  }

  private _handleDateHover(date: Date): void {
    if (this._pickState() === 'picking') {
      this._hoverDate.set(date);
      this._panelRef?.setInput('hoverDate', date);
    }
  }

  private _handleClear(): void {
    this.rangeStart.set(null);
    this.rangeEnd.set(null);
    this._hoverDate.set(null);
    this._pickState.set('idle');

    this._panelRef?.setInput('rangeStart', null);
    this._panelRef?.setInput('rangeEnd', null);
    this._panelRef?.setInput('hoverDate', null);

    this._emitValue({ from: null, to: null });
  }

  private _emitValue(val: DateRange): void {
    this._onChange(val);

    // Sync FormGroup if provided
    const fg = this.rangeFormGroup();
    if (fg) {
      fg.patchValue({ from: val.from, to: val.to }, { emitEvent: false });
    }
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

    // If we were mid-pick, revert to idle and restore previous complete range
    if (this._pickState() === 'picking') {
      this._pickState.set('idle');
      // If no completed range, clear anchor
      if (!this.rangeEnd()) {
        this.rangeStart.set(null);
      }
    }

    this._hoverDate.set(null);
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

  private _toDate(val: unknown): Date | null {
    if (val instanceof Date) return val;
    if (val && typeof val === 'string') return new Date(val);
    return null;
  }
}
