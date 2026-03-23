import { Component, signal } from '@angular/core';
import { BlocInputDirective, BlocInputGroupDirective, BlocPrefixDirective, BlocSuffixDirective } from 'bloc-ui';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [BlocInputDirective, BlocInputGroupDirective, BlocPrefixDirective, BlocSuffixDirective, IconComponent],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  readonly name = signal('');
}
