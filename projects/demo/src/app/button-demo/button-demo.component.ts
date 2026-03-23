import { Component } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [BlocButtonComponent],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
  onButtonClick(): void {
    console.log('Primary button clicked!');
  }
}
