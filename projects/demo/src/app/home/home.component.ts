import { Meta, Title } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
})
export class HomeComponent {
    readonly components = [
        {
            name: 'Accordion',
            path: '/accordion',
            description: 'Collapsible disclosure sections with single-open and multi-expand modes.',
            icon: 'A',
        },
        {
            name: 'Alert',
            path: '/alert',
            description: 'Inline feedback banners with semantic variants and optional dismissal.',
            icon: 'Al',
        },
        {
            name: 'Autocomplete',
            path: '/autocomplete',
            description: 'Searchable option picker with keyboard navigation and Angular forms support.',
            icon: 'Au',
        },
        {
            name: 'Badge',
            path: '/badge',
            description: 'Compact status labels and counters with size and variant presets.',
            icon: 'B',
        },
        {
            name: 'Button',
            path: '/button',
            description: 'Versatile action buttons with variants, loading states, and icon support.',
            icon: 'Bt',
        },
        {
            name: 'Input',
            path: '/input',
            description: 'Styled text inputs with validation, error messages, and floating labels.',
            icon: 'In',
        },
        {
            name: 'Progress',
            path: '/progress',
            description: 'Accessible progress bars with labels, value display, and intent colours.',
            icon: 'P',
        },
        {
            name: 'Select',
            path: '/select',
            description:
                'Overlay-backed single select with keyboard navigation, filtering, and Angular forms support.',
            icon: 'S',
        },
        {
            name: 'Skeleton',
            path: '/skeleton',
            description: 'Shimmering placeholders for loading text, cards, avatars, and layouts.',
            icon: 'Sk',
        },
        {
            name: 'Textarea',
            path: '/textarea',
            description: 'Auto-themed multi-line text areas with validation and Angular forms support.',
            icon: 'T',
        },
        {
            name: 'Checkbox',
            path: '/checkbox',
            description: 'Accessible checkboxes with indeterminate state and custom styling.',
            icon: 'C',
        },
        {
            name: 'Radio',
            path: '/radio',
            description: 'Radio groups with keyboard navigation and reactive form support.',
            icon: 'R',
        },
        {
            name: 'Toggle',
            path: '/toggle',
            description: 'On/off toggle switches with smooth animations and ARIA labels.',
            icon: 'Tg',
        },
        {
            name: 'Modal',
            path: '/modal',
            description: 'Declarative modals with backdrop dismiss, focus trapping, and stacking.',
            icon: 'M',
        },
        {
            name: 'Layout Sidebar',
            path: '/layout',
            description: 'Sidebar and content shell primitives for dashboards and app workspaces.',
            icon: 'L',
        },
        {
            name: 'Pagination',
            path: '/pagination',
            description: 'Page navigation with boundary pages, sibling ranges, and ellipsis handling.',
            icon: 'Pg',
        },
        {
            name: 'Slider',
            path: '/slider',
            description: 'Range control with CVA support, labels, and a styled progress track.',
            icon: 'Sl',
        },
        {
            name: 'Spinner',
            path: '/spinner',
            description: 'Loading indicators with configurable size, speed, and colour tokens.',
            icon: 'Sp',
        },
        {
            name: 'Table',
            path: '/table',
            description: 'Declarative data tables with sortable columns and custom cell templates.',
            icon: 'Tb',
        },
        {
            name: 'Tab',
            path: '/tab',
            description:
                'Accessible tab groups with keyboard navigation and lazy content rendering.',
            icon: 'Ta',
        },
        {
            name: 'Toast',
            path: '/toast',
            description:
                'Stackable notification toasts with auto-dismiss, actions, and positioning.',
            icon: 'To',
        },
        {
            name: 'Date Picker',
            path: '/date-picker',
            description:
                'Calendar-based date selection with keyboard navigation and format control.',
            icon: 'D',
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
                'All-in-one umbrella package installs core, theme, and every component package in one dependency.',
        },
        {
            name: '@bloc-ui/core',
            npm: 'npm i @bloc-ui/core',
            badge: 'C',
            badgeBg: 'bg-blue-100',
            badgeText: 'text-blue-600',
            description:
                'Structure, behaviour, and accessibility with minimal styling and CSS custom-property driven theming.',
        },
        {
            name: '@bloc-ui/theme',
            npm: 'npm i @bloc-ui/theme',
            badge: 'T',
            badgeBg: 'bg-purple-100',
            badgeText: 'text-purple-600',
            description:
                'Optional design layer for colours, typography, border radii, and light or dark tokens.',
        },
        {
            name: '@bloc-ui/modal',
            npm: 'npm i @bloc-ui/modal',
            badge: 'M',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-600',
            description:
                'Declarative modal dialogs with backdrop dismiss, focus trapping, stacking, and service-based opening.',
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
            description: 'Minimal footprint with lean Angular code and focused package boundaries.',
            icon: 'LT',
        },
        {
            title: 'Themeable',
            description: 'CSS custom properties give you full colour and typography control.',
            icon: 'TH',
        },
        {
            title: 'Accessible',
            description: 'ARIA attributes, keyboard navigation, and screen reader support are built in.',
            icon: 'AX',
        },
        {
            title: 'Standalone',
            description: 'Every component works with standalone imports or NgModule wrappers.',
            icon: 'ST',
        },
        {
            title: 'Dark Mode Ready',
            description: 'Optional `@bloc-ui/theme` ships light and dark tokens out of the box.',
            icon: 'DM',
        },
        {
            title: 'Tailwind Friendly',
            description: 'Zero-specificity base styles keep utility classes in control.',
            icon: 'TW',
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
        this.title.setTitle('Bloc UI - Lightweight Angular Component Library');
        this.meta.updateTag({
            name: 'description',
            content:
                'Bloc UI is a lightweight, themeable, and accessible Angular component library. Build modern UIs with buttons, inputs, modals, toggles, and more.',
        });
        this.meta.updateTag({
            name: 'keywords',
            content:
                'Angular, component library, UI library, Bloc UI, accessible components, lightweight, themeable, CSS custom properties, dark mode, Tailwind CSS, standalone components',
        });
        this.meta.updateTag({
            property: 'og:title',
            content: 'Bloc UI - Lightweight Angular Component Library',
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
            content: 'Bloc UI - Lightweight Angular Component Library',
        });
        this.meta.updateTag({
            name: 'twitter:description',
            content:
                'A lightweight, themeable, and accessible Angular component library with zero-specificity base styles.',
        });
    }
}
