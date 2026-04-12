import { Component } from '@angular/core';
import {
    BlocAccordionComponent,
    BlocAccordionItemDirective,
    BlocAccordionTriggerDirective,
    BlocAccordionContentDirective,
    BlocAccordionChevronDirective,
} from '@bloc-ui/accordion';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import { IconComponent } from '../icon/icon.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-accordion-demo',
    standalone: true,
    imports: [
        BlocAccordionComponent,
        BlocAccordionItemDirective,
        BlocAccordionTriggerDirective,
        BlocAccordionContentDirective,
        BlocAccordionChevronDirective,
        InstallCommandComponent,
        SampleCodeComponent,
        IconComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputsAccordion: string[][] = [
        ['multi', 'boolean', 'false', 'Allows multiple items to be expanded simultaneously.'],
    ];

    readonly inputsItem: string[][] = [
        ['expanded', 'boolean (model)', 'false', 'Two-way bindable expanded state of the item.'],
        ['disabled', 'boolean', 'false', 'Prevents the item from being toggled.'],
    ];

    readonly inputsTrigger: string[][] = [
        [
            'chevron',
            'boolean',
            'true',
            'Shows/hides the default chevron icon. Use <code>blocAccordionChevron</code> on a custom icon to replace it.',
    ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-accordion-border', '#d1d5db', 'Item border and panel divider colour.'],
        ['--bloc-accordion-radius', '0.375rem', 'Item border radius.'],
        ['--bloc-accordion-bg', '#ffffff', 'Item background colour.'],
        ['--bloc-accordion-header-bg', 'transparent', 'Trigger button background.'],
        ['--bloc-accordion-header-hover-bg', '#f3f4f6', 'Trigger hover background.'],
        [
            '--bloc-accordion-focus-ring',
            '--bloc-primary / #6b7280',
            'Focus outline colour on the trigger.',
    ],
        ['--bloc-accordion-title-color', 'inherited', 'Trigger title text colour.'],
        ['--bloc-accordion-color', '#374151', 'Panel content text colour.'],
    ];

    readonly snippets = {
        basic: `<bloc-accordion class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Overview</button>\n    <div blocAccordionContent>\n      Summary content goes here.\n    </div>\n  </div>\n  <div blocAccordionItem>\n    <button blocAccordionTrigger>Details</button>\n    <div blocAccordionContent>\n      More detail goes here.\n    </div>\n  </div>\n</bloc-accordion>`,
        multi: `<bloc-accordion [multi]="true" class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Design tokens</button>\n    <div blocAccordionContent>\n      Keep spacing and typography in sync across the system.\n    </div>\n  </div>\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Accessibility</button>\n    <div blocAccordionContent>\n      Preserve semantic structure and keyboard affordances.\n    </div>\n  </div>\n</bloc-accordion>`,
        disabled: `<bloc-accordion class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Enabled section</button>\n    <div blocAccordionContent>\n      This section works normally.\n    </div>\n  </div>\n  <div blocAccordionItem [disabled]="true">\n    <button blocAccordionTrigger>Disabled section</button>\n    <div blocAccordionContent>\n      This content cannot be reached.\n    </div>\n  </div>\n</bloc-accordion>`,
        richContent: `<bloc-accordion class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Getting started</button>\n    <div blocAccordionContent>\n      <ol>\n        <li>Install the package</li>\n        <li>Import the directives</li>\n        <li>Add &lt;bloc-accordion&gt; to your template</li>\n      </ol>\n    </div>\n  </div>\n</bloc-accordion>`,
        theming: `<bloc-accordion class="gap-3"\n  style="--bloc-accordion-border: #e2e8f0;\n         --bloc-accordion-header-hover-bg: #f0fdf4;\n         --bloc-accordion-focus-ring: #16a34a;\n         --bloc-accordion-title-color: #166534;\n         --bloc-accordion-color: #15803d">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>Customised header</button>\n    <div blocAccordionContent>\n      All token values are driven by CSS custom properties.\n    </div>\n  </div>\n</bloc-accordion>`,
        customIcon: `<bloc-accordion class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger>\n      Installation\n      <app-icon blocAccordionChevron name="plus" />\n    </button>\n    <div blocAccordionContent>\n      Run npm install @bloc-ui\/accordion to get started.\n    </div>\n  </div>\n</bloc-accordion>`,
        noChevron: `<bloc-accordion class="gap-3">\n  <div blocAccordionItem [expanded]="true">\n    <button blocAccordionTrigger [chevron]="false">Overview</button>\n    <div blocAccordionContent>Summary content goes here.</div>\n  </div>\n  <div blocAccordionItem>\n    <button blocAccordionTrigger [chevron]="false">Details</button>\n    <div blocAccordionContent>More detail goes here.</div>\n  </div>\n</bloc-accordion>`,
    };
}
