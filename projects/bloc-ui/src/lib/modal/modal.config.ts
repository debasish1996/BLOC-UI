import { InjectionToken } from '@angular/core';

/**
 * Injection token for data passed to a modal content component.
 *
 * Inside your content component:
 * ```ts
 * readonly data = inject<MyData>(BLOC_MODAL_DATA);
 * ```
 * Always available — resolves to `null` when no data was provided.
 */
export const BLOC_MODAL_DATA = new InjectionToken<unknown>('BLOC_MODAL_DATA');

/** Options accepted by `BlocModalService.open()`. */
export interface BlocModalConfig<D = unknown> {
  /** Text shown in the modal header. */
  title?: string;
  /** Dialog width variant. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg';
  /** Close the modal when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
  /** Arbitrary data injected into the content component via `inject(BLOC_MODAL_DATA)`. */
  data?: D;
}
