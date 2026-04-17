import {
    Component,
    output,
    inject,
    signal,
    computed,
    viewChild,
    ElementRef,
    afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { fuzzySearch } from '@bloc-ui/autocomplete';

interface SearchItem {
    path: string;
    label: string;
    group: string;
}

@Component({
    selector: 'app-global-search',
    templateUrl: './global-search.html',
})
export class GlobalSearch {
    readonly closed = output<void>();
    private readonly router = inject(Router);

    readonly query = signal('');
    readonly activeIndex = signal(0);
    private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    readonly allItems: SearchItem[] = [
        { path: 'getting-started', label: 'Getting Started', group: 'Docs' },
        { path: 'why-bloc-ui', label: 'Why Bloc UI?', group: 'Docs' },
        { path: 'about', label: 'About', group: 'Docs' },
        { path: 'accordion', label: 'Accordion', group: 'Components' },
        { path: 'alert', label: 'Alert', group: 'Components' },
        { path: 'autocomplete', label: 'Autocomplete', group: 'Components' },
        { path: 'badge', label: 'Badge', group: 'Core Components' },
        { path: 'button', label: 'Button', group: 'Core Components' },
        { path: 'checkbox', label: 'Checkbox', group: 'Core Components' },
        { path: 'date-picker', label: 'Date Picker', group: 'Date Pickers' },
        { path: 'date-range-picker', label: 'Date Range Picker', group: 'Date Pickers' },
        { path: 'input', label: 'Input', group: 'Core Components' },
        { path: 'layout', label: 'Layout Sidebar', group: 'Components' },
        { path: 'modal', label: 'Modal', group: 'Components' },
        { path: 'pagination', label: 'Pagination', group: 'Components' },
        { path: 'progress', label: 'Progress', group: 'Core Components' },
        { path: 'radio', label: 'Radio', group: 'Core Components' },
        { path: 'select', label: 'Select', group: 'Core Components' },
        { path: 'skeleton', label: 'Skeleton', group: 'Core Components' },
        { path: 'slider', label: 'Slider', group: 'Components' },
        { path: 'spinner', label: 'Spinner', group: 'Core Components' },
        { path: 'tab', label: 'Tab', group: 'Components' },
        { path: 'table', label: 'Table', group: 'Components' },
        { path: 'text-highlight', label: 'Text Highlight', group: 'Components' },
        { path: 'textarea', label: 'Textarea', group: 'Core Components' },
        { path: 'toast', label: 'Toast', group: 'Components' },
        { path: 'toggle', label: 'Toggle', group: 'Core Components' },
        { path: 'tooltip', label: 'Tooltip', group: 'Components' },
        { path: 'virtual-scroll', label: 'Virtual Scroll', group: 'Components' },
        { path: 'video-player', label: 'Video Player', group: 'Experimental' },
    ];

    readonly filtered = computed(() => {
        const q = this.query().trim();
        if (!q) return this.allItems;
        return fuzzySearch(this.allItems, q, {
            keys: ['label', 'group'],
            threshold: 0.6,
        }).map((r) => r.item);
    });

    constructor() {
        afterNextRender(() => {
            this.inputRef()?.nativeElement.focus();
        });
    }

    onQuery(value: string): void {
        this.query.set(value);
        this.activeIndex.set(0);
    }

    onKeyDown(event: KeyboardEvent): void {
        const items = this.filtered();
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.activeIndex.update((i) => Math.min(i + 1, items.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.activeIndex.update((i) => Math.max(i - 1, 0));
                break;
            case 'Enter': {
                const item = items[this.activeIndex()];
                if (item) this.navigate(item.path);
                break;
            }
            case 'Escape':
                this.closed.emit();
                break;
        }
    }

    navigate(path: string): void {
        this.router.navigate([path]);
        this.closed.emit();
    }
}
