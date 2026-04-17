import { Component } from '@angular/core';

@Component({
    selector: 'bloc-sidebar',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './sidebar-layout.component.scss',
    host: {
        class: 'bloc-sidebar',
    },
})
export class BlocSidebarComponent {}
