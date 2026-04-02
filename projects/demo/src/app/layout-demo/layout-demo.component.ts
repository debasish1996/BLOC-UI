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
        basic: `<bloc-sidebar-layout [collapsed]="collapsed" sidebarWidth="14rem">
  <bloc-sidebar>
    <nav>
      <a>Overview</a>
      <a>Components</a>
      <a>Settings</a>
    </nav>
  </bloc-sidebar>

  <bloc-sidebar-content>
    <h4>Dashboard</h4>
  </bloc-sidebar-content>
</bloc-sidebar-layout>`,

        collapsed: `<bloc-sidebar-layout [collapsed]="true" sidebarWidth="14rem">
  <bloc-sidebar><!-- content clips to collapsedWidth --></bloc-sidebar>
  <bloc-sidebar-content>...</bloc-sidebar-content>
</bloc-sidebar-layout>`,

        themingDark: `<!-- Override tokens inline or via a theme class -->
<bloc-sidebar
  style="
    --bloc-sidebar-bg: #0f172a;
    --bloc-sidebar-color: #e2e8f0;
    --bloc-sidebar-border: #1e293b;
    --bloc-sidebar-radius: 0.75rem;
  "
>
  ...
</bloc-sidebar>`,

        themingRadius: `<!-- Adjust shape and density per panel -->
<bloc-sidebar
  style="
    --bloc-sidebar-radius: 0;
    --bloc-sidebar-padding: 0.5rem;
  "
>...</bloc-sidebar>

<bloc-sidebar-content
  style="
    --bloc-sidebar-content-radius: 0;
    --bloc-sidebar-content-padding: 0.75rem;
  "
>...</bloc-sidebar-content>`,

        responsive: `/* Built-in — switches to stacked single column at ≤900 px */
@media (max-width: 900px) {
  bloc-sidebar-layout {
    grid-template-columns: 1fr;
  }
}`,
    };

    toggleCollapsed(): void {
        this.collapsed.update((value) => !value);
    }
}
