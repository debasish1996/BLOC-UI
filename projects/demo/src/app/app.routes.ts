import { Routes } from '@angular/router';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { RadioDemoComponent } from './radio-demo/radio-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { ToggleDemoComponent } from './toggle-demo/toggle-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'button', pathMatch: 'full' },
  { path: 'button', component: ButtonDemoComponent },
  { path: 'checkbox', component: CheckboxDemoComponent },
  { path: 'input', component: InputDemoComponent },
  { path: 'modal', component: ModalDemoComponent },
  { path: 'radio', component: RadioDemoComponent },
  { path: 'spinner', component: SpinnerDemoComponent },
  { path: 'toggle', component: ToggleDemoComponent },
];
