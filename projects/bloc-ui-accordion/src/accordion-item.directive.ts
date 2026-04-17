import { Directive, inject, input, model, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BlocAccordionComponent } from './accordion.component';

let nextAccordionItemId = 0;

const ACCORDION_ITEM_CSS = [
    // Unlayered — authoritative structural rules
    '.bloc-accordion-item{display:block;overflow:clip}',
    '@layer bloc-accordion{',
    ':where(.bloc-accordion-item){',
    'border:1px solid var(--bloc-accordion-border,#d1d5db);',
    'border-radius:var(--bloc-accordion-radius,var(--bloc-radius-sm,0.375rem));',
    'background:var(--bloc-accordion-bg,#ffffff)}',

    // Trigger — structural
    '.bloc-accordion-trigger{',
    'width:100%;border:none;padding:0.5rem 1rem;display:flex;align-items:center;',
    'justify-content:space-between;gap:1rem;text-align:left;cursor:pointer;',
    'outline:none;box-sizing:border-box;appearance:none}',
    '.bloc-accordion-trigger:disabled{cursor:not-allowed;opacity:0.55}',
    '.bloc-accordion-trigger:focus-visible{',
    'outline:2px solid var(--bloc-accordion-focus-ring,var(--bloc-primary,#6b7280));',
    'outline-offset:-2px;border-radius:0.25rem}',

    // Trigger — overridable visual
    ':where(.bloc-accordion-trigger){',
    'background:var(--bloc-accordion-header-bg,transparent)}',
    ':where(.bloc-accordion-trigger:hover:not(:disabled)){',
    'background:var(--bloc-accordion-header-hover-bg,#f3f4f6)}',

    // Panel — overridable visual
    ':where(.bloc-accordion-panel){',
    'border-top:1px solid var(--bloc-accordion-border,#d1d5db)}',

    // Content — overridable visual
    ':where(.bloc-accordion-content){',
    'padding:1rem 1.1rem 1.1rem;',
    'color:var(--bloc-accordion-color,#374151);line-height:1.6}',

    // Chevron — structural (rotation on open)
    '.bloc-accordion-chevron{',
    'flex-shrink:0;transition:transform 180ms ease}',
    '.is-open>.bloc-accordion-chevron{transform:rotate(180deg)}',
    '}',
].join('');

function ensureStyles(doc: Document): void {
    if (!doc?.head || doc.getElementById('bloc-accordion-item-styles')) return;
    const style = doc.createElement('style');
    style.id = 'bloc-accordion-item-styles';
    style.textContent = ACCORDION_ITEM_CSS;
    doc.head.appendChild(style);
}

@Directive({
    selector: '[blocAccordionItem]',
    standalone: true,
    host: {
        class: 'bloc-accordion-item',
    },
})
export class BlocAccordionItemDirective implements OnInit {
    private readonly doc = inject(DOCUMENT);
    private readonly parent = inject(BlocAccordionComponent, { optional: true });

    readonly disabled = input(false);
    readonly expanded = model(false);

    readonly panelId = `bloc-accordion-panel-${nextAccordionItemId}`;
    readonly triggerId = `bloc-accordion-trigger-${nextAccordionItemId++}`;

    ngOnInit(): void {
        ensureStyles(this.doc);
    }

    toggle(): void {
        if (this.parent) {
            this.parent.toggleItem(this);
        } else {
            this.setExpanded(!this.expanded());
        }
    }

    setExpanded(value: boolean): void {
        this.expanded.set(value);
    }
}
