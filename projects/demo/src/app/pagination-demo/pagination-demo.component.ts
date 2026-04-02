import { Component, signal } from '@angular/core';
import { BlocPaginationComponent } from '@bloc-ui/pagination';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-pagination-demo',
    standalone: true,
    imports: [BlocPaginationComponent, InstallCommandComponent, SampleCodeComponent],
    templateUrl: './pagination-demo.component.html',
})
export class PaginationDemoComponent {
    readonly currentPage = signal(5);
    readonly densePage = signal(12);
    readonly compactPage = signal(8);
    readonly largePage = signal(55);
    readonly firstPage = signal(1);
    readonly lastPage = signal(8);
    readonly singlePage = signal(1);
    readonly firstLastPage = signal(10);
    readonly textLabelsPage = signal(10);

    readonly snippets = {
        basic: `<bloc-pagination\n  [(page)]="currentPage"\n  [totalPages]="8"\n></bloc-pagination>`,
        dense: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="24"\n  [siblingCount]="2"\n  [boundaryCount]="1"\n></bloc-pagination>`,
        compact: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="15"\n  [siblingCount]="1"\n  [boundaryCount]="1"\n></bloc-pagination>`,
        large: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="100"\n  [siblingCount]="1"\n  [boundaryCount]="1"\n></bloc-pagination>`,
        stateFirst: `<bloc-pagination [(page)]="page" [totalPages]="8"></bloc-pagination>\n<!-- page starts at 1 — Prev is auto-disabled -->`,
        stateLast: `<bloc-pagination [(page)]="page" [totalPages]="8"></bloc-pagination>\n<!-- page equals totalPages — Next is auto-disabled -->`,
        stateSingle: `<bloc-pagination [(page)]="page" [totalPages]="1"></bloc-pagination>`,
        disabled: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="8"\n  [disabled]="true"\n></bloc-pagination>`,
        firstLast: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="20"\n  [showFirstLast]="true"\n></bloc-pagination>`,
        customLabels: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="20"\n  [showFirstLast]="true"\n  prevLabel="Prev"\n  nextLabel="Next"\n  firstLabel="First"\n  lastLabel="Last"\n></bloc-pagination>`,
        theming: `<bloc-pagination\n  [(page)]="page"\n  [totalPages]="8"\n  style="\n    --bloc-pagination-active-bg: #059669;\n    --bloc-pagination-radius: 9999px;\n    --bloc-pagination-border: #d1fae5;\n  "\n></bloc-pagination>`,
    };
}
