import { Component, input } from '@angular/core';

@Component({
    selector: 'bloc-sidebar-layout',
    standalone: true,
    template: `<ng-content />`,
    styleUrl: './sidebar-layout.component.scss',
    host: {
        class: 'bloc-sidebar-layout',
        '[class.bloc-sidebar-layout--collapsed]': 'collapsed()',
        '[style.--bloc-sidebar-width]': 'sidebarWidth()',
        '[style.--bloc-sidebar-collapsed-width]': 'collapsedWidth()',
        '[style.--bloc-sidebar-gap]': 'gap()',
    },
})
export class BlocSidebarLayoutComponent {
    readonly collapsed = input(false);
    readonly sidebarWidth = input('18rem');
    readonly collapsedWidth = input('4.75rem');
    readonly gap = input('1.25rem');
}
