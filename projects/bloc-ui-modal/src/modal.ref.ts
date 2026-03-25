import { Subject } from 'rxjs';

/**
 * A reference to an open modal. Returned by `BlocModalService.open()`.
 *
 * Use it to close the modal programmatically or to react when it closes:
 * ```ts
 * const ref = this.modal.open(MyComponent);
 * ref.afterClosed$.subscribe(result => console.log(result));
 * ref.close('done');
 * ```
 */
export class BlocModalRef<Comp = unknown, R = unknown> {
    private readonly _afterClosed$ = new Subject<R | undefined>();

    /** Observable that emits once with the result value when the modal closes. */
    readonly afterClosed$ = this._afterClosed$.asObservable();

    /** Instance of the component rendered inside the modal body. */
    componentInstance!: Comp;

    /** @internal Teardown function registered by BlocModalService. */
    _destroy!: () => void;

    /** Close the modal, optionally passing a result value back to the opener. */
    close(result?: R): void {
        if (this._afterClosed$.closed) return;
        this._destroy?.();
        this._afterClosed$.next(result);
        this._afterClosed$.complete();
    }
}
