import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly menuItems = [
    { path: 'button', label: 'Button' },
    { path: 'checkbox', label: 'Checkbox' },
    { path: 'date-picker', label: 'Date Picker' },
    { path: 'input', label: 'Input' },
    { path: 'modal', label: 'Modal' },
    { path: 'radio', label: 'Radio' },
    { path: 'spinner', label: 'Spinner' },
    { path: 'tab', label: 'Tab' },
    { path: 'table', label: 'Table' },
    { path: 'toast', label: 'Toast' },
    { path: 'toggle', label: 'Toggle' },
  ];
}
