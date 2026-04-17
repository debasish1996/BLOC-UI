import { Component } from '@angular/core';
import { BlocVirtualScrollComponent, BlocVirtualItemDirective } from '@bloc-ui/virtual-scroll';
import { BlocTableComponent, BlocColumnComponent, BlocCellDefDirective } from '@bloc-ui/table';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
} from '../api-table/api-table.component';

interface User {
    [key: string]: unknown;
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
}

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-virtual-scroll-demo',
    standalone: true,
    imports: [
        BlocVirtualScrollComponent,
        BlocVirtualItemDirective,
        BlocTableComponent,
        BlocColumnComponent,
        BlocCellDefDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './virtual-scroll-demo.component.html',
})
export class VirtualScrollDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;

    readonly inputs: string[][] = [
        ['items', 'T[]', '[]', 'Full data array to virtualise.'],
        [
            'itemHeight',
            'number (required)',
            '—',
            'Estimated row height in pixels. Used for scroll math on unmeasured items.',
        ],
        [
            'overscan',
            'number',
            '10',
            'Number of extra items rendered above and below the visible viewport.',
        ],
        [
            'autoMeasure',
            'boolean',
            'false',
            'Measures actual rendered row heights and caches them. Required for variable-height rows.',
        ],
    ];

    readonly exportedState: string[][] = [
        [
            'visibleItems()',
            'T[]',
            'Signal getter returning the currently rendered slice of <code>items</code>.',
        ],
        [
            'scrollToIndex(index)',
            'void',
            'Scrolls the viewport so the item at the given absolute index is at the top.',
        ],
    ];

    readonly templateContext: string[][] = [
        ['$implicit (let-item)', 'T', 'The data item for this row.'],
        [
            'index (let-i="index")',
            'number',
            'Absolute index of this item in the full <code>items</code> array.',
        ],
    ];
    /* ── 10 000 simple items ── */
    readonly simpleItems = Array.from({ length: 10_000 }, (_, i) => ({
        id: i + 1,
        label: `Item #${i + 1}`,
    }));

    /* ── 5 000 table rows ── */
    readonly tableRows: User[] = Array.from({ length: 5_000 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['Admin', 'Editor', 'Viewer'][i % 3],
        status: i % 5 === 0 ? ('Inactive' as const) : ('Active' as const),
    }));

    /* ── 10 000 rich items ── */
    readonly richItems = Array.from({ length: 10_000 }, (_, i) => ({
        id: i + 1,
        name: `Person ${i + 1}`,
        initials: `P${i + 1}`,
        role: ['Engineer', 'Designer', 'Manager', 'Analyst'][i % 4],
    }));

    /* ── 500 mixed-height items (stress test) ── */
    readonly mixedItems = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        label: `Item #${i + 1}`,
        tall: i % 7 === 0, // every 7th row is oversized
        description:
            i % 7 === 0
                ? 'This row has a LOT more content than itemHeight allows. '.repeat(300)
                : 'Normal row.',
    }));

    readonly snippets = {
        basic: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-virtual-scroll [items]="items" [itemHeight]="40"
                     style="height: 400px">
  <ng-template blocVirtualItem let-item let-i="index">
    <div style="height: 40px; padding: 8px 16px;
         border-bottom: 1px solid #e2e8f0">
      {{ i + 1 }}. {{ item.label }}
    </div>
  </ng-template>
</bloc-virtual-scroll>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVirtualScrollComponent, BlocVirtualItemDirective } from '@bloc-ui/virtual-scroll';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly items = Array.from({ length: 10_000 }, (_, i) => ({
    id: i + 1,
    label: \`Item #\${i + 1}\`,
  }));
}`,
            },
        ],
        table: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-virtual-scroll [items]="rows" [itemHeight]="48"
                     style="height: 500px"
                     #vs="blocVirtualScroll">
  <bloc-table [data]="vs.visibleItems()" [sticky]="true">
    <bloc-column field="id"     header="#" />
    <bloc-column field="name"   header="Name" />
    <bloc-column field="email"  header="Email" />
    <bloc-column field="role"   header="Role" />
  </bloc-table>
</bloc-virtual-scroll>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVirtualScrollComponent } from '@bloc-ui/virtual-scroll';
import { BlocTableComponent, BlocColumnComponent } from '@bloc-ui/table';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVirtualScrollComponent, BlocTableComponent, BlocColumnComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly rows = Array.from({ length: 5_000 }, (_, i) => ({
    id: i + 1,
    name: \`User \${i + 1}\`,
    email: \`user\${i + 1}@example.com\`,
    role: ['Admin', 'Editor', 'Viewer'][i % 3],
  }));
}`,
            },
        ],
        custom: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-virtual-scroll [items]="people" [itemHeight]="56"
                     style="height: 400px">
  <ng-template blocVirtualItem let-person let-i="index">
    <div style="height: 56px; display: flex; align-items: center;
         gap: 12px; padding: 0 16px;
         border-bottom: 1px solid #e2e8f0">
      <div class="avatar">{{ person.initials }}</div>
      <div>
        <div class="font-medium">{{ person.name }}</div>
        <div class="text-sm text-slate-400">{{ person.role }}</div>
      </div>
    </div>
  </ng-template>
</bloc-virtual-scroll>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocVirtualScrollComponent, BlocVirtualItemDirective } from '@bloc-ui/virtual-scroll';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  readonly people = Array.from({ length: 10_000 }, (_, i) => ({
    id: i + 1,
    name: \`Person \${i + 1}\`,
    initials: \`P\${i + 1}\`,
    role: ['Engineer', 'Designer', 'Manager', 'Analyst'][i % 4],
  }));
}`,
            },
        ],
    };
}
