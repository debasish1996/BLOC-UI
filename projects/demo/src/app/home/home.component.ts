import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly components = [
    {
      name: 'Button',
      path: '/button',
      description: 'Versatile action buttons with variants, loading states, and icon support.',
      icon: '👆',
    },
    {
      name: 'Input',
      path: '/input',
      description: 'Styled text inputs with validation, error messages, and floating labels.',
      icon: '✏️',
    },
    {
      name: 'Checkbox',
      path: '/checkbox',
      description: 'Accessible checkboxes with indeterminate state and custom styling.',
      icon: '☑️',
    },
    {
      name: 'Radio',
      path: '/radio',
      description: 'Radio groups with keyboard navigation and reactive form support.',
      icon: '🔘',
    },
    {
      name: 'Toggle',
      path: '/toggle',
      description: 'On/off toggle switches with smooth animations and ARIA labels.',
      icon: '🔀',
    },
    {
      name: 'Modal',
      path: '/modal',
      description: 'Declarative modals with backdrop dismiss, focus trapping, and stacking.',
      icon: '🪟',
    },
    {
      name: 'Spinner',
      path: '/spinner',
      description: 'Loading indicators with configurable size, speed, and colour tokens.',
      icon: '⏳',
    },
  ];

  readonly features = [
    {
      title: 'Lightweight',
      description: 'Minimal footprint — no heavy dependencies, just lean Angular code.',
      icon: '🪶',
    },
    {
      title: 'Themeable',
      description: 'CSS custom properties for full colour and typography control.',
      icon: '🎨',
    },
    {
      title: 'Accessible',
      description: 'ARIA attributes, keyboard navigation, and screen reader support built in.',
      icon: '♿',
    },
    {
      title: 'Standalone',
      description: 'Every component works with standalone imports or NgModule.',
      icon: '📦',
    },
    {
      title: 'Dark Mode Ready',
      description: 'Optional @bloc-ui/theme ships light and dark tokens out of the box.',
      icon: '🌙',
    },
    {
      title: 'Tailwind Friendly',
      description: 'Zero-specificity base styles — Tailwind utilities always win.',
      icon: '🌊',
    },
  ];

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Bloc UI — Lightweight Angular Component Library');
    this.meta.updateTag({
      name: 'description',
      content:
        'Bloc UI is a lightweight, themeable, and accessible Angular component library. Build modern UIs with buttons, inputs, modals, toggles, and more — all with zero-specificity base styles and full CSS custom property theming.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Angular, component library, UI library, Bloc UI, accessible components, lightweight, themeable, CSS custom properties, dark mode, Tailwind CSS, standalone components',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Bloc UI — Lightweight Angular Component Library' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'A lightweight, themeable, and accessible Angular component library with zero-specificity base styles.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Bloc UI — Lightweight Angular Component Library' });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        'A lightweight, themeable, and accessible Angular component library with zero-specificity base styles.',
    });
  }
}
