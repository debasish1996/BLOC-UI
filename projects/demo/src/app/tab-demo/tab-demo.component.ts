import { Component } from '@angular/core';
import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

@Component({
    selector: 'app-tab-demo',
    standalone: true,
    imports: [
        BlocTabGroupComponent,
        BlocTabComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
    ],
    templateUrl: './tab-demo.component.html',
})
export class TabDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputsTabGroup: string[][] = [
        ['selectedIndex', 'number', '0', 'Index of the initially active tab.'],
    ];

    readonly outputsTabGroup: string[][] = [
        ['selectedIndexChange', 'number', 'Emits the new index whenever the active tab changes.'],
    ];

    readonly inputsTab: string[][] = [
        ['label', 'string', '—', 'Label displayed in the tab header. Required.'],
        ['disabled', 'boolean', 'false', 'Prevents this tab from being selected.'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-tab-padding', '10px 16px', 'Padding of each tab button.'],
        ['--bloc-tab-font-size', '0.875rem', 'Font size of tab buttons.'],
        ['--bloc-tab-header-gap', '0', 'Gap between tab buttons in the header.'],
        ['--bloc-tab-border', '#d1d5db', 'Bottom border colour of the tab header.'],
        ['--bloc-tab-color', '#6b7280', 'Inactive tab text colour.'],
        ['--bloc-tab-hover-color', '#374151', 'Tab text colour on hover.'],
        ['--bloc-tab-active-color', '#374151', 'Active tab text colour.'],
        ['--bloc-tab-indicator', '#6b7280', 'Colour of the active tab bottom indicator.'],
        ['--bloc-tab-focus-ring', '#6b7280', 'Focus outline colour for keyboard navigation.'],
        ['--bloc-tab-body-padding', '16px 0', 'Padding of the tab panel body.'],
    ];

    selectedIndex = 0;

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-tab-group>\n  <bloc-tab label="Profile">Profile content</bloc-tab>\n  <bloc-tab label="Settings">Settings content</bloc-tab>\n  <bloc-tab label="Billing">Billing content</bloc-tab>\n</bloc-tab-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTabGroupComponent, BlocTabComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        manualSizing: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-tab-group\n  style="--bloc-tab-padding: 6px 12px;\n         --bloc-tab-font-size: 0.8125rem;\n         --bloc-tab-body-padding: 12px 0">\n  <bloc-tab label="Tab 1">…</bloc-tab>\n  <bloc-tab label="Tab 2">…</bloc-tab>\n</bloc-tab-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTabGroupComponent, BlocTabComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        disabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-tab-group>\n  <bloc-tab label="Active">…</bloc-tab>\n  <bloc-tab label="Disabled" [disabled]="true">…</bloc-tab>\n  <bloc-tab label="Another">…</bloc-tab>\n</bloc-tab-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTabGroupComponent, BlocTabComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        selectedIndex: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-tab-group [selectedIndex]="1"\n  (selectedIndexChange)="onTabChange($event)">\n  <bloc-tab label="First">…</bloc-tab>\n  <bloc-tab label="Second">…</bloc-tab>\n</bloc-tab-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTabGroupComponent, BlocTabComponent],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {\n  selectedIndex = 1;\n\n  onTabChange(index: number): void {\n    this.selectedIndex = index;\n  }\n}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-tab-group class="custom-tabs">\n  <bloc-tab label="Tab 1">…</bloc-tab>\n  <bloc-tab label="Tab 2">…</bloc-tab>\n</bloc-tab-group>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocTabGroupComponent, BlocTabComponent],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-tabs {\n  --bloc-tab-indicator: #16a34a;\n  --bloc-tab-active-color: #16a34a;\n}`,
            },
        ],
    };
}
