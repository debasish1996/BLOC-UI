import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { BlocInputDirective, BlocInputGroupDirective, BlocPrefixDirective, BlocSuffixDirective, BlocInputErrorDirective } from 'bloc-ui';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [BlocInputDirective, BlocInputGroupDirective, BlocPrefixDirective, BlocSuffixDirective, BlocInputErrorDirective, IconComponent, ReactiveFormsModule],
  templateUrl: './input-demo.component.html',
})
export class InputDemoComponent {
  readonly name = signal('');

  /** Touched + invalid → shows error border automatically */
  readonly emailCtrl = new FormControl('', [Validators.required, Validators.email]);
}
