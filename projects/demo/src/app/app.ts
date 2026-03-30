import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
    path: string;
    label: string;
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

    readonly standaloneItems: MenuItem[] = [
        { path: 'accordion', label: 'Accordion' },
        { path: 'alert', label: 'Alert' },
        { path: 'autocomplete', label: 'Autocomplete' },
        { path: 'layout', label: 'Layout Sidebar' },
        { path: 'modal', label: 'Modal' },
        { path: 'pagination', label: 'Pagination' },
        { path: 'slider', label: 'Slider' },
        { path: 'table', label: 'Table' },
        { path: 'tab', label: 'Tab' },
        { path: 'toast', label: 'Toast' },
    ];

    readonly coreExpanded = signal(this._isCoreRoute(this.router.url));
    readonly datePickerExpanded = signal(this._isDatePickerRoute(this.router.url));

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
            });
    }

    toggleCore(): void {
        this.coreExpanded.update((v) => !v);
    }

    toggleDatePicker(): void {
        this.datePickerExpanded.update((v) => !v);
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
}
