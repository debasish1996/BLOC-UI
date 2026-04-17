import { Component } from '@angular/core';

@Component({
    selector: 'bloc-sidebar-content',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './sidebar-layout.component.scss',
    host: {
        class: 'bloc-sidebar-content',
    },
})
export class BlocSidebarContentComponent {}
