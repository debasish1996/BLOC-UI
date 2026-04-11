import { Component, inject, signal, DOCUMENT } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
    path: string;
    label: string;
    beta?: boolean;
}

interface MenuGroup {
    label: string;
    children: MenuItem[];
}

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private readonly router = inject(Router);
    private readonly doc = inject(DOCUMENT);

    /** Mobile drawer state */
    readonly sidebarOpen = signal(false);

    readonly coreGroup: MenuGroup = {
        label: 'Core Components',
        children: [
            { path: 'badge', label: 'Badge' },
            { path: 'button', label: 'Button' },
            { path: 'input', label: 'Input' },
            { path: 'progress', label: 'Progress' },
            { path: 'select', label: 'Select' },
            { path: 'skeleton', label: 'Skeleton' },
            { path: 'textarea', label: 'Textarea' },
            { path: 'checkbox', label: 'Checkbox' },
            { path: 'radio', label: 'Radio' },
            { path: 'spinner', label: 'Spinner' },
            { path: 'toggle', label: 'Toggle' },
        ],
    };

    readonly datePickerGroup: MenuGroup = {
        label: 'Date Pickers',
        children: [
            { path: 'date-picker', label: 'Date Picker' },
            { path: 'date-range-picker', label: 'Date Range Picker' },
        ],
    };

    readonly aboutItem: MenuItem = { path: 'about', label: 'About' };
    readonly whyItem: MenuItem = { path: 'why-bloc-ui', label: 'Why Bloc UI?' };

    readonly experimentalGroup: MenuGroup = {
        label: 'Experimental',
        children: [{ path: 'video-player', label: 'Video Player' }],
    };

    readonly standaloneItems: MenuItem[] = [
        { path: 'accordion', label: 'Accordion' },
        { path: 'alert', label: 'Alert' },
        { path: 'autocomplete', label: 'Autocomplete' },
        { path: 'layout', label: 'Layout Sidebar', beta: true },
        { path: 'modal', label: 'Modal' },
        { path: 'pagination', label: 'Pagination' },
        { path: 'slider', label: 'Slider' },
        { path: 'table', label: 'Table' },
        { path: 'tab', label: 'Tab' },
        { path: 'text-highlight', label: 'Text Highlight', beta: true },
        { path: 'toast', label: 'Toast' },
        { path: 'tooltip', label: 'Tooltip' },
        { path: 'virtual-scroll', label: 'Virtual Scroll' },
    ];

    readonly coreExpanded = signal(this._isCoreRoute(this.router.url));
    readonly datePickerExpanded = signal(this._isDatePickerRoute(this.router.url));
    readonly experimentalExpanded = signal(this._isExperimentalRoute(this.router.url));

    constructor() {
        this.router.events
            .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
            .subscribe((e) => {
                if (this._isCoreRoute(e.urlAfterRedirects)) {
                    this.coreExpanded.set(true);
                }
                if (this._isDatePickerRoute(e.urlAfterRedirects)) {
                    this.datePickerExpanded.set(true);
                }
                if (this._isExperimentalRoute(e.urlAfterRedirects)) {
                    this.experimentalExpanded.set(true);
                }
                // Auto-close mobile drawer on navigation
                this.closeSidebar();
            });
    }

    openSidebar(): void {
        this.sidebarOpen.set(true);
        this.doc.body.classList.add('sidebar-open');
    }

    closeSidebar(): void {
        this.sidebarOpen.set(false);
        this.doc.body.classList.remove('sidebar-open');
    }

    toggleSidebar(): void {
        this.sidebarOpen() ? this.closeSidebar() : this.openSidebar();
    }

    toggleCore(): void {
        this.coreExpanded.update((v) => !v);
    }

    toggleDatePicker(): void {
        this.datePickerExpanded.update((v) => !v);
    }

    toggleExperimental(): void {
        this.experimentalExpanded.update((v) => !v);
    }

    private _isCoreRoute(url: string): boolean {
        const path = url.split('?')[0].replace(/^\//, '');
        return this.coreGroup.children.some(
            (c) => path === c.path || path.startsWith(c.path + '/'),
        );
    }

    private _isDatePickerRoute(url: string): boolean {
        const path = url.split('?')[0].replace(/^\//, '');
        return this.datePickerGroup.children.some(
            (c) => path === c.path || path.startsWith(c.path + '/'),
        );
    }

    private _isExperimentalRoute(url: string): boolean {
        const path = url.split('?')[0].replace(/^\//, '');
        return this.experimentalGroup.children.some(
            (c) => path === c.path || path.startsWith(c.path + '/'),
        );
    }
}
