import { Component } from '@angular/core';
import { BlocSpinnerDirective } from 'bloc-ui';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-spinner-demo',
  standalone: true,
  imports: [BlocSpinnerDirective, SampleCodeComponent],
  templateUrl: './spinner-demo.component.html',
})
export class SpinnerDemoComponent {
  readonly snippets = {
    presetSizes: `<bloc-spinner size="xs" />\n<bloc-spinner size="sm" />\n<bloc-spinner size="md" />\n<bloc-spinner size="lg" />\n<bloc-spinner size="xl" />`,
    default: `<span blocSpinner></span>`,
    customInputs: `<span blocSpinner width="56px" height="56px"></span>\n<span blocSpinner width="4rem" height="4rem"></span>`,
    customClass: `<span blocSpinner class="w-16 h-16"></span>`,
    customColour: `<span blocSpinner size="lg"\n  class="text-emerald-500"></span>\n<span blocSpinner size="lg"\n  class="text-amber-500"></span>`,
  };
}
