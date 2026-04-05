import { Component } from '@angular/core';
import { BlocVirtualScrollComponent, BlocVirtualItemDirective } from '@bloc-ui/virtual-scroll';
import { BlocTableComponent, BlocColumnComponent, BlocCellDefDirective } from '@bloc-ui/table';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

interface User {
    [key: string]: unknown;
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
}

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
    ],
    templateUrl: './virtual-scroll-demo.component.html',
})
export class VirtualScrollDemoComponent {
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

    readonly snippets = {
        basic: `<bloc-virtual-scroll [items]="items" [itemHeight]="40"
                     style="height: 400px">
  <ng-template blocVirtualItem let-item let-i="index">
    <div style="height: 40px; padding: 8px 16px;
         border-bottom: 1px solid #e2e8f0">
      {{ i + 1 }}. {{ item.label }}
    </div>
  </ng-template>
</bloc-virtual-scroll>`,

        table: `<bloc-virtual-scroll [items]="rows" [itemHeight]="48"
                     style="height: 500px"
                     #vs="blocVirtualScroll">
  <bloc-table [data]="vs.visibleItems()" [sticky]="true">
    <bloc-column field="id"     header="#" />
    <bloc-column field="name"   header="Name" />
    <bloc-column field="email"  header="Email" />
    <bloc-column field="role"   header="Role" />
  </bloc-table>
</bloc-virtual-scroll>`,

        custom: `<bloc-virtual-scroll [items]="people" [itemHeight]="56"
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
    };
}
