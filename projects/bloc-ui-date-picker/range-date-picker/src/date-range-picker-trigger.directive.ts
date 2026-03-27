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
    signal,
    ViewContainerRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    BlocCalendarPanelComponent,
    createDropdownWrapper,
    ensureStyles,
    listenOutside,
    positionDropdown,
    teardownDropdown,
} from '@bloc-ui/date-picker/calendar-panel';

export interface DateRange {
    from: Date | null;
    to: Date | null;
}

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

    private _onChange: (val: DateRange) => void = () => {};
    private _onTouched: () => void = () => {};

    private _panelRef: ComponentRef<BlocCalendarPanelComponent> | null = null;
    private _wrapper: HTMLElement | null = null;
    private _listeners: { unlisten: () => void } | null = null;

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

        panel.resetView(this.rangeStart());

        this._wrapper = createDropdownWrapper(
            this._doc,
            this._el.nativeElement,
            this._panelRef.location.nativeElement,
            'Date range picker',
        );
        positionDropdown(this._wrapper, this._el.nativeElement);

        this.isOpen.set(true);
        this._onTouched();

        this._listeners = listenOutside(this._el.nativeElement, this._wrapper, () => this._close());
    }

    private _handleDateSelect(date: Date): void {
        if (this._pickState() === 'idle') {
            this.rangeStart.set(date);
            this.rangeEnd.set(null);
            this._hoverDate.set(null);
            this._pickState.set('picking');

            this._panelRef?.setInput('rangeStart', date);
            this._panelRef?.setInput('rangeEnd', null);
            this._panelRef?.setInput('hoverDate', null);
        } else {
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
        const fg = this.rangeFormGroup();
        if (fg) {
            fg.patchValue({ from: val.from, to: val.to }, { emitEvent: false });
        }
    }

    private _close(): void {
        teardownDropdown(this._panelRef, this._wrapper, this._listeners);
        this._panelRef = null;
        this._wrapper = null;
        this._listeners = null;

        if (this._pickState() === 'picking') {
            this._pickState.set('idle');
            if (!this.rangeEnd()) {
                this.rangeStart.set(null);
            }
        }

        this._hoverDate.set(null);
        this.isOpen.set(false);
    }

    private _toDate(val: unknown): Date | null {
        if (val instanceof Date) return val;
        if (val && typeof val === 'string') return new Date(val);
        return null;
    }
}
