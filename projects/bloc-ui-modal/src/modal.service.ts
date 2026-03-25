import {
    inject,
    Injectable,
    ApplicationRef,
    createComponent,
    Injector,
    Type,
    StaticProvider,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BlocModalRef } from './modal.ref';
import { BlocModal, BlocModalConfig, BLOC_MODAL_DATA } from './modal.config';
import { BlocModalContainerComponent } from './modal.component';

/** @internal Extracts the result type from a `BlocModal` subclass. */
type ModalResult<C> = C extends { __blocModalResult?: infer R } ? R : unknown;
/** @internal Extracts the input/data type from a `BlocModal` subclass. */
type ModalData<C> = C extends BlocModal<infer D, any> ? D : unknown;

@Injectable({ providedIn: 'root' })
export class BlocModalService {
    private readonly _appRef = inject(ApplicationRef);
    private readonly _injector = inject(Injector);
    private readonly _doc = inject(DOCUMENT);

    /**
     * Dynamically opens `component` inside a modal dialog.
     *
     * ```ts
     * const ref = this.modal.open(ConfirmComponent, { title: 'Confirm', size: 'sm' });
     * ref.afterClosed$.subscribe(result => console.log(result));
     * ```
     *
     * @param component  Standalone component to render in the modal body.
     * @param config     Optional title, size, backdrop behaviour, and data.
     * @returns          A `BlocModalRef` to close the modal or react to closure.
     */
    open<Comp extends BlocModal<any, any>, R = ModalResult<Comp>>(
        component: Type<Comp>,
        config: BlocModalConfig<ModalData<Comp>> = {},
    ): BlocModalRef<Comp, R> {
        const modalRef = new BlocModalRef<Comp, R>();

        // Provide BlocModalRef and optional data to both the shell and the content component.
        const providers: StaticProvider[] = [
            { provide: BlocModalRef, useValue: modalRef },
            { provide: BLOC_MODAL_DATA, useValue: config.data ?? null },
        ];
        const childInjector = Injector.create({ providers, parent: this._injector });

        // Create the shell container.
        const containerRef = createComponent(BlocModalContainerComponent, {
            environmentInjector: this._appRef.injector,
            elementInjector: childInjector,
        });

        containerRef.setInput('title', config.title ?? '');
        containerRef.setInput('size', config.size ?? 'md');
        containerRef.setInput('showBackdrop', config.showBackdrop ?? true);
        containerRef.setInput('closeOnBackdropClick', config.closeOnBackdropClick ?? true);
        containerRef.setInput('showCloseButton', config.showCloseButton ?? true);
        containerRef.setInput('backdropClass', config.backdropClass ?? '');
        containerRef.setInput('panelClass', config.panelClass ?? '');

        this._appRef.attachView(containerRef.hostView);
        this._doc.body.appendChild(containerRef.location.nativeElement);

        // Drive the first change-detection cycle so that @ViewChild(static:true) is resolved.
        containerRef.changeDetectorRef.detectChanges();

        // Create the content component inside the shell's outlet.
        const contentRef = containerRef.instance.contentVcr.createComponent(component, {
            injector: childInjector,
        });

        modalRef.componentInstance = contentRef.instance;
        modalRef._destroy = () => {
            (containerRef.location.nativeElement as HTMLElement).remove();
            this._appRef.detachView(containerRef.hostView);
            containerRef.destroy();
        };

        return modalRef;
    }
}
