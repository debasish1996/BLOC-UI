import { Component } from '@angular/core';
import { BlocSkeletonDirective } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';
import {
    ApiTableComponent,
    INPUTS_COLUMNS,
    TOKENS_COLUMNS,
} from '../api-table/api-table.component';

import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

@Component({
    selector: 'app-skeleton-demo',
    standalone: true,
    imports: [
        BlocSkeletonDirective,
        SampleCodeComponent,
        InstallCommandComponent,
        ApiTableComponent,
        BlocTabGroupComponent,
        BlocTabComponent,
    ],
    templateUrl: './skeleton-demo.component.html',
})
export class SkeletonDemoComponent {
    readonly INPUTS_COLUMNS = INPUTS_COLUMNS;
    readonly TOKENS_COLUMNS = TOKENS_COLUMNS;

    readonly inputs: string[][] = [
        [
            'shape',
            "'line' | 'rect' | 'circle'",
            "'line'",
            'Shape preset controlling dimensions and border radius.',
        ],
        ['animated', 'boolean', 'true', 'Enables or disables the shimmer animation.'],
        [
            'width',
            'string',
            "''",
            'Explicit width (e.g. <code>"200px"</code>, <code>"100%"</code>). Overrides shape default.',
        ],
        [
            'height',
            'string',
            "''",
            'Explicit height (e.g. <code>"16px"</code>, <code>"4rem"</code>). Overrides shape default.',
        ],
    ];

    readonly tokens: string[][] = [
        ['--bloc-skeleton-bg', '#d1d5db', 'Skeleton background colour.'],
        [
            '--bloc-skeleton-radius',
            '8px',
            'Border radius (overridden to <code>9999px</code> for the circle shape).',
        ],
        ['--bloc-skeleton-shimmer', 'rgba(255,255,255,0.55)', 'Shimmer highlight colour.'],
        ['--bloc-skeleton-line-height', '1rem', 'Default height for the <code>line</code> shape.'],
        ['--bloc-skeleton-rect-height', '96px', 'Default height for the <code>rect</code> shape.'],
        [
            '--bloc-skeleton-circle-size',
            '48px',
            'Default width and height for the <code>circle</code> shape.',
        ],
    ];

    readonly snippets = {
        textLines: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<div blocSkeleton width="70%"></div>\n<div blocSkeleton width="100%"></div>\n<div blocSkeleton width="55%"></div>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSkeletonDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSkeletonDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        shapes: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-skeleton shape="circle"></bloc-skeleton>\n<bloc-skeleton shape="rect" height="80px"></bloc-skeleton>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSkeletonDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSkeletonDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        static: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-skeleton [animated]="false" height="1rem"></bloc-skeleton>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSkeletonDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSkeletonDirective],\n  templateUrl: './example.component.html',\n})\nexport class ExampleComponent {}`,
            },
        ],
        customToken: [
            {
                label: 'HTML',
                language: 'xml',
                code: `<bloc-skeleton\n  height="1rem"\n  class="custom-skeleton"></bloc-skeleton>`,
            },
            {
                label: 'TypeScript',
                language: 'typescript',
                code: `import { Component } from '@angular/core';\nimport { BlocSkeletonDirective } from '@bloc-ui/core';\n\n@Component({\n  selector: 'app-example',\n  standalone: true,\n  imports: [BlocSkeletonDirective],\n  templateUrl: './example.component.html',\n  styleUrl: './example.component.css',\n})\nexport class ExampleComponent {}`,
            },
            {
                label: 'CSS',
                language: 'css',
                code: `.custom-skeleton {\n  --bloc-skeleton-bg: #cbd5e1;\n}`,
            },
        ],
    };
}
