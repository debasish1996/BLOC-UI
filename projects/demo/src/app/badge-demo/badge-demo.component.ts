import { Component } from '@angular/core';
import { BlocBadgeComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-badge-demo',
    standalone: true,
    imports: [BlocBadgeComponent, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
    readonly snippets = {
        variants: `<bloc-badge>Neutral</bloc-badge>\n<bloc-badge variant="primary">Primary</bloc-badge>\n<bloc-badge variant="success">Success</bloc-badge>\n<bloc-badge variant="warning">Warning</bloc-badge>\n<bloc-badge variant="danger">Danger</bloc-badge>`,
        sizes: `<bloc-badge size="sm">Small</bloc-badge>\n<bloc-badge size="md">Medium</bloc-badge>\n<bloc-badge size="lg">Large</bloc-badge>`,
        pill: `<bloc-badge variant="primary" [pill]="true">99+</bloc-badge>`,
        customToken: `<bloc-badge\n  style="--bloc-badge-bg: #111827; --bloc-badge-color: #f8fafc">\n  Custom\n</bloc-badge>`,
    };
}
