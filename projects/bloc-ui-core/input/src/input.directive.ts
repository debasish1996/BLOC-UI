import {
    Directive,
    inject,
    input,
    computed,
    signal,
    DestroyRef,
    OnInit,
    ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, fromEvent } from 'rxjs';

const INPUT_CSS = [
    // Unlayered — authoritative structural rules, intentionally not overridable
    'input.bloc-input{outline:none;box-sizing:border-box;appearance:none}',
    // @layer bloc-input — declared first so any later Tailwind/consumer layer wins
    '@layer bloc-input{',
    ':where(input.bloc-input){',
    'border:1px solid var(--bloc-input-border,var(--bloc-border,#cbd5e1));',
    'border-radius:var(--bloc-input-radius,4px);',
    'padding:var(--bloc-input-padding,8px 12px);',
    'font-size:var(--bloc-input-font-size,14px);',
    'line-height:1.5;',
    'width:100%;',
    'background-color:var(--bloc-input-bg,#ffffff);',
    'color:var(--bloc-input-color,#374151)}',
    ':where(input.bloc-input:focus){border-color:var(--bloc-input-focus-border,var(--bloc-primary,#6b7280))}',
    ':where(input.bloc-input:disabled){opacity:0.5;cursor:not-allowed}',
    ':where(input.bloc-input.bloc-input--error){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    ':where(input.bloc-input.bloc-input--error:focus){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    // Autofill inside error group — keep bg token consistent
    'input.bloc-input.bloc-input--error:-webkit-autofill,',
    'input.bloc-input.bloc-input--error:-webkit-autofill:focus{',
    '-webkit-box-shadow:0 0 0px 1000px var(--bloc-input-bg,#ffffff) inset!important}',
    // Autofill hack — overpaints Chrome's yellow/blue autofill background
    'input.bloc-input:-webkit-autofill,',
    'input.bloc-input:-webkit-autofill:hover,',
    'input.bloc-input:-webkit-autofill:focus{',
    '-webkit-box-shadow:0 0 0px 1000px var(--bloc-input-bg,#ffffff) inset!important;',
    '-webkit-text-fill-color:var(--bloc-input-color,#374151)!important;',
    'transition:background-color 5000s ease-in-out 0s}',
    '}',
].join('');

function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-input-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-input-styles';
    style.textContent = INPUT_CSS;
    doc.head.appendChild(style);
}

const INPUT_GROUP_CSS = [
    // Unlayered — structural anchor, no overridable opinions
    '.bloc-input-group{box-sizing:border-box}',
    '@layer bloc-input-group{',
    ':where(.bloc-input-group){',
    'display:inline-flex;align-items:center;overflow:hidden;width:100%;',
    'border:1px solid var(--bloc-input-group-border,var(--bloc-border,#cbd5e1));',
    'border-radius:var(--bloc-input-group-radius,4px);',
    'background-color:var(--bloc-input-group-bg,#ffffff)}',
    ':where(.bloc-input-group:has(input.bloc-input:focus)){',
    'border-color:var(--bloc-input-group-focus-border,var(--bloc-primary,#6b7280))}',
    ':where(.bloc-input-group input.bloc-input){',
    'border:none;border-radius:0;background:transparent;flex:1;min-width:0;width:auto}',
    ':where(.bloc-input-group input.bloc-input:focus){border-color:transparent}',
    ':where(.bloc-input-prefix),:where(.bloc-input-suffix){',
    'display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;',
    'padding:var(--bloc-input-group-adornment-padding,0 8px);',
    'color:var(--bloc-input-group-adornment-color,#9ca3af)}',
    // Error border on the group wrapper (must live in same layer to override default border)
    ':where(.bloc-input-group:has(input.bloc-input.bloc-input--error)){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    ':where(.bloc-input-group:has(input.bloc-input.bloc-input--error:focus)){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    ':where(.bloc-input-group.bloc-input--error){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    ':where(.bloc-input-group.bloc-input--error:has(input.bloc-input:focus)){border-color:var(--bloc-input-error-border,var(--bloc-error,#f87171))}',
    '}',
].join('');

function ensureGroupStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-input-group-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-input-group-styles';
    style.textContent = INPUT_GROUP_CSS;
    doc.head.appendChild(style);
}

@Directive({
    selector: 'input[blocInput]',
    standalone: true,
    host: {
        '[class.bloc-input]': 'true',
        '[class.bloc-input--error]': 'hasError()',
        '[attr.autocomplete]': 'autocomplete()',
        '[attr.aria-invalid]': 'hasError() || null',
    },
})
export class BlocInputDirective implements OnInit {
    /**
     * Controls the browser autocomplete/autofill behaviour.
     * Pass `"off"` to suppress suggestion dropdowns.
     * Defaults to `null` (browser decides).
     */
    readonly autocomplete = input<string | null>(null);

    /** Explicit error flag. When `true` the error style is applied regardless of form state. */
    readonly error = input<boolean>(false);

    private readonly ngControl = inject(NgControl, { optional: true, self: true });
    private readonly destroyRef = inject(DestroyRef);
    private readonly el = inject(ElementRef<HTMLInputElement>);
    private readonly _controlError = signal(false);

    readonly hasError = computed(() => this.error() || this._controlError());

    constructor() {
        ensureStyles(inject(DOCUMENT));
    }

    ngOnInit(): void {
        const ctrl = this.ngControl?.control;
        if (!ctrl) return;
        const sync = () => this._controlError.set(ctrl.invalid && ctrl.touched);
        // blur sets touched — must listen to it since statusChanges/valueChanges don't fire on blur
        merge(ctrl.statusChanges, ctrl.valueChanges, fromEvent(this.el.nativeElement, 'blur'))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(sync);
    }
}

/** @deprecated Use BlocInputDirective */
export { BlocInputDirective as BlocInputComponent };

@Directive({
    selector: 'bloc-input-group, [blocInputGroup]',
    standalone: true,
    host: { '[class.bloc-input-group]': 'true' },
})
export class BlocInputGroupDirective {
    constructor() {
        ensureGroupStyles(inject(DOCUMENT));
    }
}

@Directive({
    selector: 'bloc-prefix, [blocPrefix]',
    standalone: true,
    host: { '[class.bloc-input-prefix]': 'true' },
})
export class BlocPrefixDirective {}

@Directive({
    selector: 'bloc-suffix, [blocSuffix]',
    standalone: true,
    host: { '[class.bloc-input-suffix]': 'true' },
})
export class BlocSuffixDirective {}

export const BLOC_INPUT_GROUP_DIRECTIVES = [
    BlocInputGroupDirective,
    BlocPrefixDirective,
    BlocSuffixDirective,
] as const;
