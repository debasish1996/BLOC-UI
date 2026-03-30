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
    readonly currentPage = signal(4);
    readonly densePage = signal(12);

    readonly snippets = {
        basic: `<bloc-pagination\n  [page]="currentPage"\n  [totalPages]="8"\n  (pageChange)="currentPage = $event"\n></bloc-pagination>`,
        dense: `<bloc-pagination\n  [page]="page"\n  [totalPages]="24"\n  [siblingCount]="2"\n  [boundaryCount]="1"\n  (pageChange)="page = $event"\n></bloc-pagination>`,
    };
}
