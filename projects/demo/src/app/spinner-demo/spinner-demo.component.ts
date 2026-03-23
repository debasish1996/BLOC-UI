import { Component } from '@angular/core';
import { BlocSpinnerDirective } from 'bloc-ui';

@Component({
  selector: 'app-spinner-demo',
  standalone: true,
  imports: [BlocSpinnerDirective],
  templateUrl: './spinner-demo.component.html',
})
export class SpinnerDemoComponent { }
