import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui-core';
import { IconComponent } from '../icon/icon.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [BlocButtonComponent, IconComponent, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
    loadingPrimary = signal(false);
    loadingSecondary = signal(false);
    loadingOutline = signal(false);
    loadingCustomIcon = signal(false);

    readonly snippets = {
        primary: `<button blocButton variant="primary">\n  Primary Button\n</button>`,
        secondary: `<button blocButton variant="secondary">\n  Secondary Button\n</button>`,
        outline: `<button blocButton variant="outline">\n  Outline Button\n</button>`,
        disabled: `<button blocButton variant="primary" [disabled]="true">\n  Disabled Button\n</button>`,
        disabledOutline: `<button blocButton variant="outline" [disabled]="true">\n  Disabled Outline\n</button>`,
        loadingPrimary: `<button blocButton variant="primary"\n  [loading]="isLoading()">\n  Submit\n</button>`,
        loadingSecondary: `<button blocButton variant="secondary"\n  [loading]="isLoading()">\n  Save Draft\n</button>`,
        loadingOutline: `<button blocButton variant="outline"\n  [loading]="isLoading()">\n  Export\n</button>`,
        leadingIcon: `<button blocButton variant="primary">\n  <app-icon name="check" />\n  Confirm\n</button>`,
        trailingIcon: `<button blocButton variant="outline">\n  Continue\n  <app-icon name="arrow-right" />\n</button>`,
        fullWidth: `<button blocButton variant="primary" class="w-full">\n  Full Width\n</button>`,
        customToken: `<div style="--bloc-primary: #7c3aed; --bloc-secondary: #0ea5e9">\n  <button blocButton variant="primary">Custom Primary</button>\n  <button blocButton variant="secondary">Custom Secondary</button>\n</div>`,
        customLoader: `<ng-template #myLoader>\n  <!-- your own icon/SVG -->\n  <span class="..."></span>\n</ng-template>\n\n<button blocButton variant="primary"\n  [loading]="isLoading()"\n  [loadingTemplate]="myLoader">\n  Submit\n</button>`,
    };

    onButtonClick(): void {
        console.log('Primary button clicked!');
    }

    simulateLoad(flag: ReturnType<typeof signal<boolean>>): void {
        flag.set(true);
        setTimeout(() => flag.set(false), 2500);
    }
}
