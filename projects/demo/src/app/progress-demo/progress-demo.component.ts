import { Component, signal } from '@angular/core';
import { BlocButtonComponent, BlocProgressComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-progress-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        BlocProgressComponent,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './progress-demo.component.html',
})
export class ProgressDemoComponent {
    readonly uploadProgress = signal(42);

    readonly snippets = {
        variants: `<bloc-progress [value]="18"></bloc-progress>\n<bloc-progress variant="success" [value]="63"></bloc-progress>\n<bloc-progress variant="warning" [value]="78"></bloc-progress>\n<bloc-progress variant="danger" [value]="92"></bloc-progress>`,
        sizes: `<bloc-progress size="sm" [value]="30"></bloc-progress>\n<bloc-progress size="md" [value]="52"></bloc-progress>\n<bloc-progress size="lg" [value]="74"></bloc-progress>`,
        labelled: `<bloc-progress label="Upload progress"\n  [showValue]="true"\n  [value]="uploadProgress()"></bloc-progress>`,
        customToken: `<bloc-progress\n  [value]="64"\n  style="--bloc-progress-track-bg: #dbeafe; --bloc-progress-fill: #2563eb"></bloc-progress>`,
    };

    increase(): void {
        this.uploadProgress.update((value) => Math.min(value + 12, 100));
    }

    decrease(): void {
        this.uploadProgress.update((value) => Math.max(value - 12, 0));
    }
}
