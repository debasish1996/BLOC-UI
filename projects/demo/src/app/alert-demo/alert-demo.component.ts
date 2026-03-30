import { Component, signal } from '@angular/core';
import { BlocAlertComponent } from '@bloc-ui/alert';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-alert-demo',
    standalone: true,
    imports: [BlocAlertComponent, InstallCommandComponent, SampleCodeComponent],
    templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
    readonly dismissed = signal(false);

    readonly snippets = {
        basic: `<bloc-alert variant="info" title="Heads up">\n  Alerts work well for inline guidance, success messaging, and warnings.\n</bloc-alert>`,
        dismissible: `<bloc-alert\n  variant="warning"\n  title="Sync paused"\n  [dismissible]="true"\n>\n  Reconnect to resume background sync.\n</bloc-alert>`,
    };

    restoreAlert(): void {
        this.dismissed.set(false);
    }
}
