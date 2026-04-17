import { Directive, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const INPUT_ERROR_CSS = [
    '@layer bloc-input-error{',
    ':where(.bloc-input-error){',
    'display:block;',
    'font-size:var(--bloc-input-error-font-size,0.75rem);',
    'line-height:var(--bloc-input-error-line-height,1rem);',
    'color:var(--bloc-input-error-color,var(--bloc-error,#f87171));',
    'margin-top:var(--bloc-input-error-margin-top,0)}',
    '}',
].join('');

function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-input-error-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-input-error-styles';
    style.textContent = INPUT_ERROR_CSS;
    doc.head.appendChild(style);
}

@Directive({
    selector: '[blocInputError], bloc-input-error',
    standalone: true,
    host: {
        '[class.bloc-input-error]': 'true',
        role: 'alert',
    },
})
export class BlocInputErrorDirective {
    constructor() {
        ensureStyles(inject(DOCUMENT));
    }
}
