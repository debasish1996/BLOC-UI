import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const CONTAINER_CLASS = 'bloc-overlay-container';

/**
 * Manages the single global overlay container and creates panel / backdrop
 * elements inside it.
 *
 * Consumed internally by `BlocOverlayDirective`. Can also be injected directly
 * when building custom overlay-based components (Select, Tooltip, etc.).
 */
@Injectable({ providedIn: 'root' })
export class OverlayService {
    private readonly _doc = inject(DOCUMENT);
    private _container: HTMLElement | null = null;

    /**
     * Lazily creates (or reuses) the single global overlay container appended
     * to `<body>`. The container itself carries no visual style and uses
     * `pointer-events: none` so it never intercepts clicks.
     */
    getContainer(): HTMLElement {
        if (!this._container || !this._doc.body.contains(this._container)) {
            const el = this._doc.createElement('div');
            el.classList.add(CONTAINER_CLASS);
            // Inert host — individual panels re-enable pointer events.
            el.style.cssText =
                'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;';
            this._doc.body.appendChild(el);
            this._container = el;
        }
        return this._container;
    }

    /**
     * Create a `position:fixed` panel `<div>` inside the global container.
     *
     * The caller is responsible for positioning (setting `top`/`left`) and
     * removing the element when the overlay closes.
     */
    createPanel(panelClass?: string): HTMLElement {
        const panel = this._doc.createElement('div');
        panel.style.cssText =
            'position:fixed;top:0;left:0;z-index:1001;box-sizing:border-box;pointer-events:auto;';
        if (panelClass) {
            panel.classList.add(...panelClass.trim().split(/\s+/).filter(Boolean));
        }
        this.getContainer().appendChild(panel);
        return panel;
    }

    /**
     * Create a lightweight backdrop `<div>` appended directly to `<body>`
     * (behind panels, above page content).
     *
     * The caller is responsible for removing the element on close.
     */
    createBackdrop(backdropClass?: string): HTMLElement {
        const backdrop = this._doc.createElement('div');
        backdrop.style.cssText = 'position:fixed;inset:0;z-index:1000;pointer-events:auto;';
        if (backdropClass) {
            backdrop.classList.add(...backdropClass.trim().split(/\s+/).filter(Boolean));
        }
        this._doc.body.appendChild(backdrop);
        return backdrop;
    }
}
