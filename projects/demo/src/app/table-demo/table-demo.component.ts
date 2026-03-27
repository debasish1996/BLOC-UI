import { Component } from '@angular/core';
import { BlocTableComponent, BlocColumnComponent, BlocCellDefDirective } from '@bloc-ui/table';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [
        BlocTableComponent,
        BlocColumnComponent,
        BlocCellDefDirective,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './table-demo.component.html',
})
export class TableDemoComponent {
    readonly users = [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
        { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
        { name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active' },
        { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Inactive' },
    ];

    readonly snippets = {
        basic: `<bloc-table [data]="users">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n  <bloc-column field="role" header="Role" />\n</bloc-table>`,
        striped: `<bloc-table [data]="users" [striped]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        bordered: `<bloc-table [data]="users" [bordered]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        hoverable: `<bloc-table [data]="users" [hoverable]="true">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="email" header="Email" />\n</bloc-table>`,
        sizeSmall: `<bloc-table [data]="users" size="sm">\n  …\n</bloc-table>`,
        sizeLarge: `<bloc-table [data]="users" size="lg">\n  …\n</bloc-table>`,
        customCell: `<bloc-table [data]="users">\n  <bloc-column field="name" header="Name" />\n  <bloc-column field="status" header="Status">\n    <ng-template blocCellDef let-value>\n      <span [class]="value === 'Active'\n        ? 'text-green-600' : 'text-red-500'">{{ value }}</span>\n    </ng-template>\n  </bloc-column>\n</bloc-table>`,
    };
}
