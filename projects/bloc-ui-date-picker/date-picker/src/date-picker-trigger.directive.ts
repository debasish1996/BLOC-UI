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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    BlocCalendarPanelComponent,
    createDropdownWrapper,
    ensureStyles,
    listenOutside,
    positionDropdown,
    teardownDropdown,
} from '@bloc-ui/date-picker/calendar-panel';

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
    private readonly _doc = inject(DOCUMENT);
    private readonly _destroyRef = inject(DestroyRef);

    /** Minimum selectable date. */
    readonly minDate = input<Date | null>(null);

    /** Maximum selectable date. */
    readonly maxDate = input<Date | null>(null);

    /** Disable the trigger via template binding. */
    readonly disabled = input<boolean>(false);

    /** Currently selected date. */
    readonly selectedDate = signal<Date | null>(null);

    /** Whether the calendar panel is open. */
    readonly isOpen = signal<boolean>(false);

    private readonly _formDisabled = signal<boolean>(false);
    readonly isDisabled = computed(() => this.disabled() || this._formDisabled());

    private _onChange: (val: Date | null) => void = () => {};
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
        this.selectedDate.set(val instanceof Date ? val : val ? new Date(val as string) : null);
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

        this._panelRef = this._vcr.createComponent(BlocCalendarPanelComponent);
        const panel = this._panelRef.instance;

        this._panelRef.setInput('selectedDate', this.selectedDate());
        this._panelRef.setInput('minDate', this.minDate());
        this._panelRef.setInput('maxDate', this.maxDate());

        panel.dateSelect.subscribe((date: Date) => {
            this.selectedDate.set(date);
            this._onChange(date);
            this._close();
        });
        panel.cleared.subscribe(() => {
            this.selectedDate.set(null);
            this._panelRef?.setInput('selectedDate', null);
            this._onChange(null);
        });

        panel.resetView(this.selectedDate());

        this._wrapper = createDropdownWrapper(
            this._doc,
            this._el.nativeElement,
            this._panelRef.location.nativeElement,
            'Date picker',
        );
        positionDropdown(this._wrapper, this._el.nativeElement);

        this.isOpen.set(true);
        this._onTouched();

        this._listeners = listenOutside(this._el.nativeElement, this._wrapper, () => this._close());
    }

    private _close(): void {
        teardownDropdown(this._panelRef, this._wrapper, this._listeners);
        this._panelRef = null;
        this._wrapper = null;
        this._listeners = null;
        this.isOpen.set(false);
    }
}
