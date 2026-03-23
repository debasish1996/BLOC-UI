import { Component, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  private readonly router = inject(Router);

  readonly menuItems = [
    { path: 'button', label: 'Button' },
    { path: 'input', label: 'Input' },
    { path: 'modal', label: 'Modal' },
  ];

  ngAfterViewInit(): void {
    feather.replace();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => feather.replace(), 0));
  }
}
