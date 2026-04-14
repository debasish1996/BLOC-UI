import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui-core';
import { IconComponent } from '../icon/icon.component';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    OUTPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [
        BlocButtonComponent,
        IconComponent,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly OUTPUTS_COLUMNS = OUTPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        ['variant', "'primary' | 'secondary' | 'outline'", "'primary'", 'Visual style variant.'],
        ['disabled', 'boolean', 'false', 'Disables interaction and applies muted styles.'],
        [
            'loading',
            'boolean',
            'false',
            'Shows a spinner and blocks interaction. Sets <code>aria-busy</code>.',
        ],
        [
            'loadingTemplate',
            'TemplateRef | null',
            'null',
            'Custom loading icon template; replaces the default spinner.',
        ],
    ];

    readonly outputs: string[][] = [
        [
            'clicked',
            'MouseEvent',
            'Emits on click. Suppressed when <code>disabled</code> or <code>loading</code>.',
        ],
    ];

    readonly tokens: string[][] = [
        [
            '--bloc-primary',
            '#3b82f6',
            'Primary variant background; outline border and text colour.',
        ],
        ['--bloc-secondary', '#64748b', 'Secondary variant background colour.'],
    ];
    loadingPrimary = signal(false);
    loadingSecondary = signal(false);
    loadingOutline = signal(false);
    loadingCustomIcon = signal(false);

    readonly snippets = {
        primary: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="primary">\n  Primary Button\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        secondary: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="secondary">\n  Secondary Button\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        outline: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="outline">\n  Outline Button\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        disabled: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="primary" [disabled]="true">\n  Disabled Button\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        disabledOutline: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="outline" [disabled]="true">\n  Disabled Outline\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        loadingPrimary: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="primary"\n  [loading]="isLoading()">\n  Submit\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isLoading = signal(false);
}`,
            },
        ],
        loadingSecondary: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="secondary"\n  [loading]="isLoading()">\n  Save Draft\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isLoading = signal(false);
}`,
            },
        ],
        loadingOutline: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="outline"\n  [loading]="isLoading()">\n  Export\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isLoading = signal(false);
}`,
            },
        ],
        leadingIcon: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="primary">\n  <app-icon name="check" />\n  Confirm\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        trailingIcon: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="outline">\n  Continue\n  <app-icon name="arrow-right" />\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        fullWidth: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<button blocButton variant="primary" class="w-full">\n  Full Width\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<div style="--bloc-primary: #685fff; --bloc-secondary: #0ea5e9">\n  <button blocButton variant="primary">Custom Primary</button>\n  <button blocButton variant="secondary">Custom Secondary</button>\n</div>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.css',
})
export class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `/* Apply to a parent or the component host */
.custom-buttons {
  --bloc-primary: #685fff;
  --bloc-secondary: #0ea5e9;
}`,
            },
        ],
        customLoader: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<ng-template #myLoader>\n  <!-- your own icon/SVG -->\n  <span class="..."></span>\n</ng-template>\n\n<button blocButton variant="primary"\n  [loading]="isLoading()"\n  [loadingTemplate]="myLoader">\n  Submit\n</button>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from '@bloc-ui/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isLoading = signal(false);
}`,
            },
        ],
    };

    onButtonClick(): void {
        console.log('Primary button clicked!');
    }

    simulateLoad(flag: ReturnType<typeof signal<boolean>>): void {
        flag.set(true);
        setTimeout(() => flag.set(false), 2500);
    }
}
