import { Directive, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Placed inside @layer bloc-spinner so any un-layered or later-declared layer
// (e.g. Tailwind's @layer utilities) has higher cascade priority and can freely
// override these styles without needing !important.
//
// Color model: `color` drives both arc and track.
//   arc   = currentColor  (border-top-color)
//   track = color-mix(in srgb, currentColor 20%, transparent)  (auto-derived)
// Override via --bloc-spinner-color or any Tailwind text-{color} class.
const SPINNER_CSS = [
  '@layer bloc-spinner{',
  '.bloc-spinner{display:inline-block;border-radius:50%;border-style:solid!important;',
  'color:var(--bloc-spinner-color,#6b7280);',
  'border-color:color-mix(in srgb,currentColor 20%,transparent)!important;',
  'border-top-color:currentColor!important;',
  'animation:bloc-spin 0.7s linear infinite;box-sizing:border-box;flex-shrink:0;border-width:3px!important}',
  '.bloc-spinner--xs{width:12px;height:12px;border-width:2px!important}',
  '.bloc-spinner--sm{width:16px;height:16px;border-width:2px!important}',
  '.bloc-spinner--md{width:24px;height:24px}',
  '.bloc-spinner--lg{width:32px;height:32px}',
  '.bloc-spinner--xl{width:48px;height:48px;border-width:4px!important}',
  '@keyframes bloc-spin{to{transform:rotate(360deg)}}',
  '}',
].join('');

function ensureStyles(doc: Document): void {
  if (!doc?.head || doc.getElementById('bloc-spinner-styles')) return;
  const style = doc.createElement('style');
  style.id = 'bloc-spinner-styles';
  style.textContent = SPINNER_CSS;
  doc.head.insertBefore(style, doc.head.firstChild);
}

@Directive({
  selector: 'bloc-spinner, [blocSpinner]',
  standalone: true,
  host: {
    'role': 'status',
    'aria-label': 'Loading',
    '[class.bloc-spinner]': 'true',
    '[class.bloc-spinner--xs]': 'size() === "xs"',
    '[class.bloc-spinner--sm]': 'size() === "sm"',
    '[class.bloc-spinner--md]': 'size() === "md"',
    '[class.bloc-spinner--lg]': 'size() === "lg"',
    '[class.bloc-spinner--xl]': 'size() === "xl"',
    '[style.width]': 'width() || null',
    '[style.height]': 'height() || null',
  },
})
export class BlocSpinnerDirective {
  /** Preset size. Pass null to size the element entirely via class or inline style. */
  readonly size = input<SpinnerSize | null>('md');

  /** Explicit width (e.g. "40px", "2rem"). Applies as inline style; overrides size preset. */
  readonly width = input<string>('');

  /** Explicit height (e.g. "40px", "2rem"). Applies as inline style; overrides size preset. */
  readonly height = input<string>('');

  constructor() {
    ensureStyles(inject(DOCUMENT));
  }
}
