import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui-core';
import { IconComponent } from '../icon/icon.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [BlocButtonComponent, IconComponent, SampleCodeComponent],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
  loadingPrimary = signal(false);
  loadingSecondary = signal(false);
  loadingOutline = signal(false);

  readonly snippets = {
    primary: `<button blocButton variant="primary">\n  Primary Button\n</button>`,
    secondary: `<button blocButton variant="secondary">\n  Secondary Button\n</button>`,
    outline: `<button blocButton variant="outline">\n  Outline Button\n</button>`,
    disabled: `<button blocButton variant="primary" [disabled]="true">\n  Disabled Button\n</button>`,
    disabledOutline: `<button blocButton variant="outline" [disabled]="true">\n  Disabled Outline\n</button>`,
    loadingPrimary: `<button blocButton variant="primary"\n  [loading]="isLoading()">\n  Submit\n</button>`,
    loadingSecondary: `<button blocButton variant="secondary"\n  [loading]="isLoading()">\n  Save Draft\n</button>`,
    loadingOutline: `<button blocButton variant="outline"\n  [loading]="isLoading()">\n  Export\n</button>`,
  };

  onButtonClick(): void {
    console.log('Primary button clicked!');
  }

  simulateLoad(flag: ReturnType<typeof signal<boolean>>): void {
    flag.set(true);
    setTimeout(() => flag.set(false), 2500);
  }
}
