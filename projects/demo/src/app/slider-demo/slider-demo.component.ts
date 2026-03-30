import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BlocSliderComponent } from '@bloc-ui/slider';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-slider-demo',
    standalone: true,
    imports: [ReactiveFormsModule, BlocSliderComponent, InstallCommandComponent, SampleCodeComponent],
    templateUrl: './slider-demo.component.html',
})
export class SliderDemoComponent {
    readonly volumeControl = new FormControl(35, { nonNullable: true });
    readonly budgetControl = new FormControl(60, { nonNullable: true });

    readonly snippets = {
        reactive: `<bloc-slider\n  label="Volume"\n  [min]="0"\n  [max]="100"\n  [step]="5"\n  [formControl]="volumeControl"\n></bloc-slider>`,
        customRange: `<bloc-slider\n  label="Budget allocation"\n  [min]="10"\n  [max]="120"\n  [step]="10"\n  [formControl]="budgetControl"\n></bloc-slider>`,
    };
}
