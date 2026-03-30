import { Component, inject, input, model } from '@angular/core';

import { BlocAccordionComponent } from './accordion.component';

let nextAccordionItemId = 0;

@Component({
    selector: 'bloc-accordion-item',
    standalone: true,
    template: `
        <button
            class="bloc-accordion-item__trigger"
            type="button"
            [disabled]="disabled()"
            [attr.id]="buttonId"
            [attr.aria-controls]="panelId"
            [attr.aria-expanded]="expanded()"
            (click)="toggle()"
        >
            <span class="bloc-accordion-item__title">{{ title() }}</span>
            <span class="bloc-accordion-item__chevron" [class.is-open]="expanded()">⌄</span>
        </button>

        <div
            class="bloc-accordion-item__panel"
            [attr.id]="panelId"
            [attr.aria-labelledby]="buttonId"
            [hidden]="!expanded()"
        >
            <div class="bloc-accordion-item__content">
                <ng-content />
            </div>
        </div>
    `,
    styleUrl: './accordion.component.scss',
    host: {
        class: 'bloc-accordion-item',
    },
})
export class BlocAccordionItemComponent {
    private readonly parent = inject(BlocAccordionComponent, {
        optional: true,
        host: true,
    });

    readonly title = input.required<string>();
    readonly disabled = input(false);
    readonly expanded = model(false);

    readonly panelId = `bloc-accordion-panel-${nextAccordionItemId}`;
    readonly buttonId = `bloc-accordion-trigger-${nextAccordionItemId++}`;

    toggle(): void {
        this.parent?.toggleItem(this) ?? this.setExpanded(!this.expanded());
    }

    setExpanded(value: boolean): void {
        this.expanded.set(value);
    }
}
