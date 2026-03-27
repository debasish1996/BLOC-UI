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
            description:
                'Versatile action buttons with variants, loading states, and icon support.',
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
        {
            name: 'Table',
            path: '/table',
            description: 'Declarative data tables with sortable columns and custom cell templates.',
            icon: '📊',
        },
        {
            name: 'Tab',
            path: '/tab',
            description:
                'Accessible tab groups with keyboard navigation and lazy content rendering.',
            icon: '🗂️',
        },
        {
            name: 'Toast',
            path: '/toast',
            description:
                'Stackable notification toasts with auto-dismiss, actions, and positioning.',
            icon: '🔔',
        },
        {
            name: 'Date Picker',
            path: '/date-picker',
            description:
                'Calendar-based date selection with keyboard navigation and format control.',
            icon: '📅',
        },
    ];

    readonly packages = [
        {
            name: '@bloc-ui/kit',
            npm: 'npm i @bloc-ui/kit',
            badge: 'K',
            badgeBg: 'bg-slate-200',
            badgeText: 'text-slate-700',
            description:
                'All-in-one umbrella package — installs core, theme, and every component package in a single dependency. Ideal when you want the full Bloc UI suite.',
        },
        {
            name: '@bloc-ui/core',
            npm: 'npm i @bloc-ui/core',
            badge: 'C',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-600',
            description:
                'Structure, behaviour, and accessibility. Barebone components with zero visual opinion — every colour goes through CSS custom properties with neutral-grey fallbacks.',
        },
        {
            name: '@bloc-ui/theme',
            npm: 'npm i @bloc-ui/theme',
            badge: 'T',
            badgeBg: 'bg-purple-100',
            badgeText: 'text-purple-600',
            description:
                'Optional design layer. CSS custom properties for colours, typography, border radii, and full dark mode — drop it in and every core component lights up.',
        },
        {
            name: '@bloc-ui/modal',
            npm: 'npm i @bloc-ui/modal',
            badge: 'M',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-600',
            description:
                'Declarative modal dialogs with backdrop dismiss, focus trapping, stacking, and service-based programmatic opening.',
        },
        {
            name: '@bloc-ui/table',
            npm: 'npm i @bloc-ui/table',
            badge: 'Tb',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-600',
            description:
                'Data table with declarative column definitions, sortable headers, and custom cell templates.',
        },
        {
            name: '@bloc-ui/toast',
            npm: 'npm i @bloc-ui/toast',
            badge: 'To',
            badgeBg: 'bg-rose-100',
            badgeText: 'text-rose-600',
            description:
                'Stackable notification toasts with auto-dismiss timers, action buttons, and configurable positioning.',
        },
        {
            name: '@bloc-ui/date-picker',
            npm: 'npm i @bloc-ui/date-picker',
            badge: 'D',
            badgeBg: 'bg-cyan-100',
            badgeText: 'text-cyan-600',
            description:
                'Calendar-based date picker with keyboard navigation, min/max constraints, and locale-aware formatting.',
        },
        {
            name: '@bloc-ui/tab',
            npm: 'npm i @bloc-ui/tab',
            badge: 'Ta',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-600',
            description:
                'Accessible tab group component with keyboard navigation, ARIA roles, and lazy content projection.',
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
            description:
                'ARIA attributes, keyboard navigation, and screen reader support built in.',
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

    copiedIndex: number | null = null;

    copyToClipboard(text: string, index: number): void {
        navigator.clipboard.writeText(text);
        this.copiedIndex = index;
        setTimeout(() => (this.copiedIndex = null), 1500);
    }

    constructor(
        private title: Title,
        private meta: Meta,
    ) {
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
        this.meta.updateTag({
            property: 'og:title',
            content: 'Bloc UI — Lightweight Angular Component Library',
        });
        this.meta.updateTag({
            property: 'og:description',
            content:
                'A lightweight, themeable, and accessible Angular component library with zero-specificity base styles.',
        });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
        this.meta.updateTag({
            name: 'twitter:title',
            content: 'Bloc UI — Lightweight Angular Component Library',
        });
        this.meta.updateTag({
            name: 'twitter:description',
            content:
                'A lightweight, themeable, and accessible Angular component library with zero-specificity base styles.',
        });
    }
}
