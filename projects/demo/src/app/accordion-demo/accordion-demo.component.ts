import { Component } from '@angular/core';
import { BlocAccordionComponent, BlocAccordionItemComponent } from '@bloc-ui/accordion';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-accordion-demo',
    standalone: true,
    imports: [
        BlocAccordionComponent,
        BlocAccordionItemComponent,
        InstallCommandComponent,
        SampleCodeComponent,
    ],
    templateUrl: './accordion-demo.component.html',
})
export class AccordionDemoComponent {
    readonly snippets = {
        basic: `<bloc-accordion>\n  <bloc-accordion-item title="Overview" [expanded]="true">\n    Summary content goes here.\n  </bloc-accordion-item>\n  <bloc-accordion-item title="Details">\n    More detail goes here.\n  </bloc-accordion-item>\n</bloc-accordion>`,
        multi: `<bloc-accordion [multi]="true">\n  <bloc-accordion-item title="Design tokens" [expanded]="true">\n    Keep spacing and typography in sync across the system.\n  </bloc-accordion-item>\n  <bloc-accordion-item title="Accessibility" [expanded]="true">\n    Preserve semantic structure and keyboard affordances.\n  </bloc-accordion-item>\n</bloc-accordion>`,
    };
}
