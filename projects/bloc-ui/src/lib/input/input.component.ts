import { Directive, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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
  '}',
].join('');

function ensureStyles(doc: Document): void {
  if (!doc?.head || doc.getElementById('bloc-input-styles')) return;
  const style = doc.createElement('style');
  style.id = 'bloc-input-styles';
  style.textContent = INPUT_CSS;
  doc.head.appendChild(style);
}

@Directive({
  selector: 'input[blocInput]',
  standalone: true,
  host: {
    '[class.bloc-input]': 'true',
    '[attr.autocomplete]': 'autocomplete()',
  },
})
export class BlocInputDirective {
  /**
   * Controls the browser autocomplete/autofill behaviour.
   * Pass `"off"` to suppress suggestion dropdowns.
   * Defaults to `null` (browser decides).
   */
  readonly autocomplete = input<string | null>(null);

  constructor() {
    ensureStyles(inject(DOCUMENT));
  }
}

/** @deprecated Use BlocInputDirective */
export { BlocInputDirective as BlocInputComponent };
