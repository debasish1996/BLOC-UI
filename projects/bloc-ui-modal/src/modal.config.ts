import { inject, InjectionToken } from '@angular/core';
import { BlocModalRef } from './modal.ref';

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

/**
 * Extend this abstract class on a modal content component to declare the result
 * type it will emit via `BlocModalRef.close()`. TypeScript will then infer `R`
 * automatically in `BlocModalService.open()` — no extra declarations needed.
 *
 * ```ts
 * export class ConfirmModalComponent extends BlocModal<boolean> { ... }
 * ```
 */
export abstract class BlocModal<Input, R> {
  declare readonly __blocModalResult?: R;
  public readonly modalRef = inject<BlocModalRef<unknown, R>>(BlocModalRef);
  readonly data = inject<Input>(BLOC_MODAL_DATA);
}

/** Options accepted by `BlocModalService.open()`. */
export interface BlocModalConfig<D = unknown> {
  /** Text shown in the modal header. */
  title?: string;
  /** Dialog width variant. Defaults to `'md'`. */
  size?: 'sm' | 'md' | 'lg';
  /** Show the semi-transparent backdrop behind the modal. Defaults to `true`. */
  showBackdrop?: boolean;
  /** Close the modal when the backdrop is clicked. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
  /** Show the ✕ close button in the modal header. Defaults to `true`. */
  showCloseButton?: boolean;
  /** Extra CSS class(es) added to the backdrop element. */
  backdropClass?: string;
  /** Extra CSS class(es) added to the modal panel element. */
  panelClass?: string;
  /** Arbitrary data injected into the content component via `inject(BLOC_MODAL_DATA)`. */
  data?: D;
}
