import { Component } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [BlocButtonComponent, IconComponent],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
  onButtonClick(): void {
    console.log('Primary button clicked!');
  }
}
