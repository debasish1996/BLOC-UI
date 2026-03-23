import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlocButtonComponent, BlocInputComponent } from 'bloc-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BlocButtonComponent, BlocInputComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('demo');
  protected readonly name = signal('');

  protected onButtonClick(): void {
    console.log('Button clicked! Name:', this.name());
  }
}
