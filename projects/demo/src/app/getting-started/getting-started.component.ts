import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-getting-started',
    imports: [RouterLink, InstallCommandComponent, SampleCodeComponent],
    templateUrl: './getting-started.component.html',
    styleUrl: './getting-started.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GettingStartedComponent {
    readonly kitImportCode = `import { BlocButtonComponent, BlocModalService } from '@bloc-ui/kit';`;

    readonly individualImportCode = `import { BlocButtonComponent } from '@bloc-ui/core/button';
import { BlocInputDirective } from '@bloc-ui/core/input';
import { BlocModalService } from '@bloc-ui/modal';
import { BlocTableComponent } from '@bloc-ui/table';`;

    readonly firstUsageCode = `<button blocButton variant="primary" [loading]="saving">Save</button>
<input blocInput type="text" placeholder="Email" />`;

    readonly themeCode = `// styles.scss
@use '@bloc-ui/theme/styles/bloc-theme';`;

    readonly tailwindCode = `@layer theme, base, bloc-spinner, bloc-input, bloc-input-group, bloc-input-error, components, utilities;
@import 'tailwindcss';`;
}
