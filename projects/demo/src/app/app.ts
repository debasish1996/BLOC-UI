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
    { path: 'input', label: 'Input' },
    { path: 'modal', label: 'Modal' },
    { path: 'spinner', label: 'Spinner' },
  ];
}
