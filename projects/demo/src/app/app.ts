import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlocButtonComponent, BlocInputComponent, BlocModalComponent } from 'bloc-ui';

export type MenuItem = 'button' | 'input' | 'modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlocButtonComponent, BlocInputComponent, BlocModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly activeMenu = signal<MenuItem>('button');
  protected readonly name = signal('');
  protected readonly inputValue = signal('');
  protected readonly passwordValue = signal('');
  protected readonly modalOpenSize = signal<'sm' | 'md' | 'lg' | null>(null);

  protected readonly menuItems: { id: MenuItem; label: string }[] = [
    { id: 'button', label: 'Button' },
    { id: 'input', label: 'Input' },
    { id: 'modal', label: 'Modal' },
  ];

  protected selectMenu(item: MenuItem): void {
    this.activeMenu.set(item);
  }

  protected onButtonClick(): void {
    console.log('Primary button clicked!');
  }

  protected openModal(size: 'sm' | 'md' | 'lg'): void {
    this.modalOpenSize.set(size);
  }

  protected closeModal(): void {
    this.modalOpenSize.set(null);
  }
}
