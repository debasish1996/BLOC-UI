import { Component } from '@angular/core';
import { BlocBadgeComponent, BlocButtonComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-badge-demo',
    standalone: true,
    imports: [
        BlocBadgeComponent,
        BlocButtonComponent,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './badge-demo.component.html',
})
export class BadgeDemoComponent {
    readonly snippets = {
        variants: `<bloc-badge>Neutral</bloc-badge>\n<bloc-badge variant="primary">Primary</bloc-badge>\n<bloc-badge variant="success">Success</bloc-badge>\n<bloc-badge variant="warning">Warning</bloc-badge>\n<bloc-badge variant="danger">Danger</bloc-badge>`,
        sizes: `<bloc-badge size="sm">Small</bloc-badge>\n<bloc-badge size="md">Medium</bloc-badge>\n<bloc-badge size="lg">Large</bloc-badge>`,
        pill: `<bloc-badge variant="primary" [pill]="true">99+</bloc-badge>`,
        inlineLabel: `<h3>\n  Messages <bloc-badge size="sm">3</bloc-badge>\n</h3>`,
        buttonCount: `<button blocButton variant="outline">\n  Notifications\n  <bloc-badge variant="primary" [pill]="true"\n    size="sm">5</bloc-badge>\n</button>`,
        statusList: `<ul>\n  <li>Deploy #42 <bloc-badge variant="success">Live</bloc-badge></li>\n  <li>Deploy #41 <bloc-badge variant="danger">Failed</bloc-badge></li>\n</ul>`,
        customToken: `<bloc-badge\n  style="--bloc-badge-bg: #111827;\n         --bloc-badge-color: #f8fafc;\n         --bloc-badge-border: #374151">\n  Custom\n</bloc-badge>`,
    };
}
