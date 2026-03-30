import { Component, signal } from '@angular/core';
import {
    BlocSidebarComponent,
    BlocSidebarContentComponent,
    BlocSidebarLayoutComponent,
} from '@bloc-ui/layout';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-layout-demo',
    standalone: true,
    imports: [
        BlocSidebarLayoutComponent,
        BlocSidebarComponent,
        BlocSidebarContentComponent,
        InstallCommandComponent,
        SampleCodeComponent,
    ],
    templateUrl: './layout-demo.component.html',
})
export class LayoutDemoComponent {
    readonly collapsed = signal(false);

    readonly snippets = {
        basic: `<bloc-sidebar-layout [collapsed]="collapsed">\n  <bloc-sidebar>\n    <div class="sidebar-brand">Bloc UI</div>\n    <nav>\n      <a>Overview</a>\n      <a>Components</a>\n      <a>Settings</a>\n    </nav>\n  </bloc-sidebar>\n\n  <bloc-sidebar-content>\n    <h2>Workspace</h2>\n    <p>Main content goes here.</p>\n  </bloc-sidebar-content>\n</bloc-sidebar-layout>`,
    };

    toggleCollapsed(): void {
        this.collapsed.update((value) => !value);
    }
}
