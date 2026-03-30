import { Component, computed, effect, input, model } from '@angular/core';

type PaginationToken = number | 'ellipsis';

@Component({
    selector: 'bloc-pagination',
    standalone: true,
    template: `
        <nav class="bloc-pagination__nav" [attr.aria-label]="ariaLabel()">
            <button
                class="bloc-pagination__control"
                type="button"
                [disabled]="currentPage() <= 1"
                (click)="goToPage(currentPage() - 1)"
            >
                Prev
            </button>

            <div class="bloc-pagination__pages">
                @for (token of tokens(); track $index) {
                    @if (isNumber(token)) {
                        <button
                            class="bloc-pagination__page"
                            type="button"
                            [class.is-active]="token === currentPage()"
                            [attr.aria-current]="token === currentPage() ? 'page' : null"
                            (click)="goToPage(token)"
                        >
                            {{ token }}
                        </button>
                    } @else {
                        <span class="bloc-pagination__ellipsis" aria-hidden="true">…</span>
                    }
                }
            </div>

            <button
                class="bloc-pagination__control"
                type="button"
                [disabled]="currentPage() >= normalizedTotalPages()"
                (click)="goToPage(currentPage() + 1)"
            >
                Next
            </button>
        </nav>
    `,
    styleUrl: './pagination.component.scss',
})
export class BlocPaginationComponent {
    readonly page = model(1);
    readonly totalPages = input.required<number>();
    readonly siblingCount = input(1);
    readonly boundaryCount = input(1);
    readonly ariaLabel = input('Pagination');

    readonly normalizedTotalPages = computed(() => Math.max(1, this.totalPages() || 1));
    readonly currentPage = computed(() =>
        this._clamp(this.page() || 1, 1, this.normalizedTotalPages()),
    );
    readonly tokens = computed(() =>
        this._buildTokens(
            this.currentPage(),
            this.normalizedTotalPages(),
            Math.max(0, this.siblingCount()),
            Math.max(1, this.boundaryCount()),
        ),
    );

    constructor() {
        effect(
            () => {
                const next = this.currentPage();
                if (next !== this.page()) {
                    this.page.set(next);
                }
            },
            { allowSignalWrites: true },
        );
    }

    goToPage(page: number): void {
        this.page.set(this._clamp(page, 1, this.normalizedTotalPages()));
    }

    isNumber(value: PaginationToken): value is number {
        return typeof value === 'number';
    }

    private _buildTokens(
        currentPage: number,
        totalPages: number,
        siblingCount: number,
        boundaryCount: number,
    ): PaginationToken[] {
        if (totalPages <= 1) {
            return [1];
        }

        const pages = new Set<number>();
        for (let page = 1; page <= Math.min(boundaryCount, totalPages); page += 1) {
            pages.add(page);
        }

        for (
            let page = Math.max(1, currentPage - siblingCount);
            page <= Math.min(totalPages, currentPage + siblingCount);
            page += 1
        ) {
            pages.add(page);
        }

        for (
            let page = Math.max(1, totalPages - boundaryCount + 1);
            page <= totalPages;
            page += 1
        ) {
            pages.add(page);
        }

        const sortedPages = Array.from(pages).sort((a, b) => a - b);
        const tokens: PaginationToken[] = [];

        sortedPages.forEach((page, index) => {
            if (index > 0 && page - sortedPages[index - 1] > 1) {
                tokens.push('ellipsis');
            }
            tokens.push(page);
        });

        return tokens;
    }

    private _clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
