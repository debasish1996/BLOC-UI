import { Component, signal } from '@angular/core';
import { BlocInputComponent } from 'bloc-ui';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [BlocInputComponent],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  readonly name = signal('');
  readonly inputValue = signal('');
  readonly passwordValue = signal('');
}
