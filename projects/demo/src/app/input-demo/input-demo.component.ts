import { Component, signal } from '@angular/core';
import { BlocInputDirective } from 'bloc-ui';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [BlocInputDirective],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  readonly name = signal('');
}
