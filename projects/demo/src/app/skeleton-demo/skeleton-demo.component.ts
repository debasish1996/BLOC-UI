import { Component } from '@angular/core';
import { BlocSkeletonDirective } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-skeleton-demo',
    standalone: true,
    imports: [BlocSkeletonDirective, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './skeleton-demo.component.html',
})
export class SkeletonDemoComponent {
    readonly snippets = {
        textLines: `<div blocSkeleton width="70%"></div>\n<div blocSkeleton width="100%"></div>\n<div blocSkeleton width="55%"></div>`,
        shapes: `<bloc-skeleton shape="circle"></bloc-skeleton>\n<bloc-skeleton shape="rect" height="80px"></bloc-skeleton>`,
        static: `<bloc-skeleton [animated]="false" height="1rem"></bloc-skeleton>`,
        customToken: `<bloc-skeleton\n  height="1rem"\n  style="--bloc-skeleton-bg: #cbd5e1"></bloc-skeleton>`,
    };
}
