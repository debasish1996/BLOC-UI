import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { DatePickerDemoComponent } from './date-picker-demo/date-picker-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { RadioDemoComponent } from './radio-demo/radio-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { TabDemoComponent } from './tab-demo/tab-demo.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { ToastDemoComponent } from './toast-demo/toast-demo.component';
import { ToggleDemoComponent } from './toggle-demo/toggle-demo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'button', component: ButtonDemoComponent },
  { path: 'checkbox', component: CheckboxDemoComponent },
  { path: 'date-picker', component: DatePickerDemoComponent },
  { path: 'input', component: InputDemoComponent },
  { path: 'modal', component: ModalDemoComponent },
  { path: 'radio', component: RadioDemoComponent },
  { path: 'spinner', component: SpinnerDemoComponent },
  { path: 'tab', component: TabDemoComponent },
  { path: 'table', component: TableDemoComponent },
  { path: 'toast', component: ToastDemoComponent },
  { path: 'toggle', component: ToggleDemoComponent },
];
