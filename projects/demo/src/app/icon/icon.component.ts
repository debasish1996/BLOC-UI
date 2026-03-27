import { Component, input, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as feather from 'feather-icons';
import type { FeatherIconNames } from 'feather-icons';

@Component({
    selector: 'app-icon',
    standalone: true,
    template: `<span class="inline-flex items-center" [innerHTML]="svg()"></span>`,
    host: {
        class: 'inline-flex',
    },
})
export class IconComponent {
    private readonly sanitizer = inject(DomSanitizer);

    readonly name = input.required<FeatherIconNames>();
    readonly size = input<number>(16);
    readonly strokeWidth = input<number>(2);

    readonly svg = computed(() =>
        this.sanitizer.bypassSecurityTrustHtml(
            feather.icons[this.name()]?.toSvg({
                width: this.size(),
                height: this.size(),
                'stroke-width': this.strokeWidth(),
            }) ?? '',
        ),
    );
}
