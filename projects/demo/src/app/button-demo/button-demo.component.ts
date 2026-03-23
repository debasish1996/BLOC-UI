import { Component, signal } from '@angular/core';
import { BlocButtonComponent } from 'bloc-ui';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [BlocButtonComponent, IconComponent],
  templateUrl: './button-demo.component.html',
})
export class ButtonDemoComponent {
  loadingPrimary = signal(false);
  loadingSecondary = signal(false);
  loadingOutline = signal(false);

  onButtonClick(): void {
    console.log('Primary button clicked!');
  }

  simulateLoad(flag: ReturnType<typeof signal<boolean>>): void {
    flag.set(true);
    setTimeout(() => flag.set(false), 2500);
  }
}
