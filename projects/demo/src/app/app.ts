import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlocButtonComponent, BlocInputComponent } from 'bloc-ui';

export type MenuItem = 'button' | 'input';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlocButtonComponent, BlocInputComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly activeMenu = signal<MenuItem>('button');
  protected readonly name = signal('');
  protected readonly inputValue = signal('');
  protected readonly passwordValue = signal('');

  protected readonly menuItems: { id: MenuItem; label: string }[] = [
    { id: 'button', label: 'Button' },
    { id: 'input', label: 'Input' },
  ];

  protected selectMenu(item: MenuItem): void {
    this.activeMenu.set(item);
  }

  protected onButtonClick(): void {
    console.log('Primary button clicked!');
  }
}
