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
import { BlocModalConfig, BLOC_MODAL_DATA } from './modal.config';
import { BlocModalContainerComponent } from './modal.component';

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
  open<C, R = unknown, D = unknown>(
    component: Type<C>,
    config: BlocModalConfig<D> = {},
  ): BlocModalRef<C, R> {
    const modalRef = new BlocModalRef<C, R>();

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
    containerRef.setInput('closeOnBackdropClick', config.closeOnBackdropClick ?? true);

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
