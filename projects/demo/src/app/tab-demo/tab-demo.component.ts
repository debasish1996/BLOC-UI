import { Component } from '@angular/core';
import { BlocTabGroupComponent, BlocTabComponent } from 'bloc-ui';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-tab-demo',
  standalone: true,
  imports: [BlocTabGroupComponent, BlocTabComponent, SampleCodeComponent],
  templateUrl: './tab-demo.component.html',
})
export class TabDemoComponent {
  selectedIndex = 0;

  readonly snippets = {
    basic: `<bloc-tab-group>\n  <bloc-tab label="Profile">Profile content</bloc-tab>\n  <bloc-tab label="Settings">Settings content</bloc-tab>\n  <bloc-tab label="Billing">Billing content</bloc-tab>\n</bloc-tab-group>`,
    sizeSmall: `<bloc-tab-group size="sm">\n  <bloc-tab label="Tab 1">…</bloc-tab>\n  <bloc-tab label="Tab 2">…</bloc-tab>\n</bloc-tab-group>`,
    sizeLarge: `<bloc-tab-group size="lg">\n  <bloc-tab label="Tab 1">…</bloc-tab>\n  <bloc-tab label="Tab 2">…</bloc-tab>\n</bloc-tab-group>`,
    disabled: `<bloc-tab-group>\n  <bloc-tab label="Active">…</bloc-tab>\n  <bloc-tab label="Disabled" [disabled]="true">…</bloc-tab>\n  <bloc-tab label="Another">…</bloc-tab>\n</bloc-tab-group>`,
    selectedIndex: `<bloc-tab-group [selectedIndex]="1"\n  (selectedIndexChange)="onTabChange($event)">\n  <bloc-tab label="First">…</bloc-tab>\n  <bloc-tab label="Second">…</bloc-tab>\n</bloc-tab-group>`,
    customToken: `<bloc-tab-group\n  style="--bloc-tab-indicator: #16a34a;\n         --bloc-tab-active-color: #16a34a">\n  <bloc-tab label="Tab 1">…</bloc-tab>\n  <bloc-tab label="Tab 2">…</bloc-tab>\n</bloc-tab-group>`,
  };
}
