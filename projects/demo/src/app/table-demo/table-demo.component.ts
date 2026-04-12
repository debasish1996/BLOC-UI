import { Component } from '@angular/core';
import { BlocTableComponent, BlocColumnComponent, BlocCellDefDirective } from '@bloc-ui/table';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [
        BlocTableComponent,
        BlocColumnComponent,
        BlocCellDefDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './table-demo.component.html',
})
export class TableDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['data', 'Record&lt;string, unknown&gt;[]', '[]', 'Array of row objects to display.'],
        ['striped', 'boolean', 'false', 'Applies alternating row background colours.'],
        ['bordered', 'boolean', 'false', 'Shows cell borders on all sides.'],
        ['hoverable', 'boolean', 'false', 'Highlights rows on hover.'],
        ['sticky', 'boolean', 'false', 'Keeps the header fixed while the table body scrolls.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Preset cell padding and font size.'],
        [
            'trackBy',
            'string',
            "''",
            'Row field used as the <code>&#64;for</code> track identity. Falls back to row index.',
    ],
    ];

    readonly inputsColumn: string[][] = [
        ['field', 'string', 'required', 'The object key to read from each data row.'],
        ['header', 'string', "''", 'Column header label text.'],
    ];

    readonly tokens: string[][] = [
        ['--bloc-table-border', '#d1d5db', 'Border and divider colour for header and rows.'],
        ['--bloc-table-th-bg', 'transparent', 'Header cell background colour.'],
        ['--bloc-table-th-color', '#374151', 'Header cell text colour.'],
        ['--bloc-table-td-color', '#6b7280', 'Body cell text colour.'],
        [
            '--bloc-table-stripe-bg',
            '#f9fafb',
            'Even-row background when <code>[striped]</code> is on.',
    ],
        [
            '--bloc-table-hover-bg',
            '#f3f4f6',
            'Row background on hover when <code>[hoverable]</code> is on.',
    ],
        [
            '--bloc-table-th-padding',
            '10px 14px',
            'Header cell padding (overridden by <code>size</code> variants).',
    ],
        [
            '--bloc-table-td-padding',
            '10px 14px',
            'Body cell padding (overridden by <code>size</code> variants).',
    ],
        ['--bloc-table-font-size', '0.8125rem', 'Font size for header and body cells.'],
    ];

    readonly users = [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
        { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
        { name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active' },
        { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Inactive' },
        { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Active' },
        { name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
        { name: 'Henry Wilson', email: 'henry@example.com', role: 'Viewer', status: 'Active' },
        { name: 'Iris Chen', email: 'iris@example.com', role: 'Admin', status: 'Active' },
    ];

    readonly users2 = [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
        { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
        { name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active' },
        { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Inactive' },
        { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Active' },
        { name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
        { name: 'Henry Wilson', email: 'henry@example.com', role: 'Viewer', status: 'Active' },
        { name: 'Iris Chen', email: 'iris@example.com', role: 'Admin', status: 'Active' },
        { name: 'Jack Taylor', email: 'jack@example.com', role: 'Editor', status: 'Inactive' },
        { name: 'Karen Anderson', email: 'karen@example.com', role: 'Viewer', status: 'Active' },
        { name: 'Leo Martinez', email: 'leo@example.com', role: 'Admin', status: 'Active' },
        { name: 'Maria Garcia', email: 'maria@example.com', role: 'Editor', status: 'Active' },
        {
            name: 'Nathan Rodriguez',
            email: 'nathan@example.com',
            role: 'Viewer',
            status: 'Inactive',
        },
        { name: 'Olivia Thomas', email: 'olivia@example.com', role: 'Editor', status: 'Active' },
    ];

    readonly snippets = {
        basic: `<bloc-table [data]="users">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n  <bloc-column field="role" header="Role" />\n</bloc-table>`,
        striped: `<bloc-table [data]="users" [striped]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        bordered: `<bloc-table [data]="users" [bordered]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        hoverable: `<bloc-table [data]="users" [hoverable]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        sticky: `<bloc-table [data]="users" [sticky]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n  <bloc-column field="role" header="Role" />\n</bloc-table>`,
        sizeSmall: `<bloc-table [data]="users" size="sm">\n  …\n</bloc-table>`,
        sizeLarge: `<bloc-table [data]="users" size="lg">\n  …\n</bloc-table>`,
        customCell: `<bloc-table [data]="users">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="status" header="Status">\n    <ng-template blocCellDef let-value>\n      <span [class]="value === 'Active'\n        ? 'text-green-600' : 'text-red-500'">{{ value }}</span>\n    </ng-template>\n  </bloc-column>\n</bloc-table>`,
        emptyData: `<bloc-table [data]="[]">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n  <bloc-column field="role" header="Role" />\n</bloc-table>`,
        customToken: `<bloc-table [data]="users"\n  style="--bloc-table-th-bg: #f0fdf4;\n         --bloc-table-border: #86efac;\n         --bloc-table-th-color: #15803d">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
    };
}
