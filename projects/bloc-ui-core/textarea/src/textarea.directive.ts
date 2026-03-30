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

const TEXTAREA_CSS = [
    'textarea.bloc-textarea{outline:none;box-sizing:border-box;appearance:none;resize:vertical}',
    '@layer bloc-textarea{',
    ':where(textarea.bloc-textarea){',
    'border:1px solid var(--bloc-textarea-border,var(--bloc-input-border,var(--bloc-border,#cbd5e1)));',
    'border-radius:var(--bloc-textarea-radius,var(--bloc-input-radius,4px));',
    'padding:var(--bloc-textarea-padding,var(--bloc-input-padding,8px 12px));',
    'font-size:var(--bloc-textarea-font-size,var(--bloc-input-font-size,14px));',
    'line-height:1.5;',
    'width:100%;',
    'min-height:var(--bloc-textarea-min-height,96px);',
    'background-color:var(--bloc-textarea-bg,var(--bloc-input-bg,#ffffff));',
    'color:var(--bloc-textarea-color,var(--bloc-input-color,#374151))}',
    ':where(textarea.bloc-textarea:focus){border-color:var(--bloc-textarea-focus-border,var(--bloc-input-focus-border,var(--bloc-primary,#6b7280)))}',
    ':where(textarea.bloc-textarea:disabled){opacity:0.5;cursor:not-allowed}',
    ':where(textarea.bloc-textarea.bloc-textarea--error){border-color:var(--bloc-textarea-error-border,var(--bloc-input-error-border,var(--bloc-error,#f87171)))}',
    ':where(textarea.bloc-textarea.bloc-textarea--error:focus){border-color:var(--bloc-textarea-error-border,var(--bloc-input-error-border,var(--bloc-error,#f87171)))}',
    '}',
].join('');

function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-textarea-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-textarea-styles';
    style.textContent = TEXTAREA_CSS;
    doc.head.appendChild(style);
}

@Directive({
    selector: 'textarea[blocTextarea]',
    standalone: true,
    host: {
        '[class.bloc-textarea]': 'true',
        '[class.bloc-textarea--error]': 'hasError()',
        '[attr.aria-invalid]': 'hasError() || null',
    },
})
export class BlocTextareaDirective implements OnInit {
    /** Explicit error flag. When `true` the error style is applied regardless of form state. */
    readonly error = input<boolean>(false);

    private readonly ngControl = inject(NgControl, { optional: true, self: true });
    private readonly destroyRef = inject(DestroyRef);
    private readonly el = inject(ElementRef<HTMLTextAreaElement>);
    private readonly controlError = signal(false);

    readonly hasError = computed(() => this.error() || this.controlError());

    constructor() {
        ensureStyles(inject(DOCUMENT));
    }

    ngOnInit(): void {
        const ctrl = this.ngControl?.control;
        if (!ctrl) return;
        const sync = () => this.controlError.set(ctrl.invalid && ctrl.touched);
        merge(ctrl.statusChanges, ctrl.valueChanges, fromEvent(this.el.nativeElement, 'blur'))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(sync);
    }
}

/** @deprecated Use BlocTextareaDirective */
export { BlocTextareaDirective as BlocTextareaComponent };
