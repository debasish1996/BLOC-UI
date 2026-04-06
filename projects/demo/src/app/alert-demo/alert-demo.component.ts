import { Component, signal } from '@angular/core';
import { BlocAlertComponent, BlocAlertIconDirective } from '@bloc-ui/alert';

import { IconComponent } from '../icon/icon.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-alert-demo',
    standalone: true,
    imports: [
        BlocAlertComponent,
        BlocAlertIconDirective,
        IconComponent,
        InstallCommandComponent,
        SampleCodeComponent,
    ],
    templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
    readonly dismissed = signal(false);

    readonly snippets = {
        basic: `<bloc-alert variant="info" title="Heads up">\n  Alerts work well for inline guidance, success messaging, and warnings.\n</bloc-alert>`,
        dismissible: `<bloc-alert\n  variant="warning"\n  title="Sync paused"\n  [dismissible]="true"\n>\n  Reconnect to resume background sync.\n</bloc-alert>`,
        customIcon: `<bloc-alert variant="success" title="Deployed">\n  <svg blocAlertIcon ...>...</svg>\n  Your build passed all checks and is live in production.\n</bloc-alert>`,
        noIcon: `<bloc-alert variant="info" title="Scheduled maintenance" [hideIcon]="true">\n  The system will be unavailable on Sunday between 02:00 and 04:00 UTC.\n</bloc-alert>`,
    };

    restoreAlert(): void {
        this.dismissed.set(false);
    }
}
