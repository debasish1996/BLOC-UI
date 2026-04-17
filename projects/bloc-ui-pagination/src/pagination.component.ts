import { Component, computed, effect, input, model } from '@angular/core';

type PaginationToken = number | 'ellipsis';

@Component({
    selector: 'bloc-pagination',
    standalone: true,
    template: `
        <nav class="bloc-pagination__nav" [attr.aria-label]="ariaLabel()">
            @if (showFirstLast()) {
                <button
                    class="bloc-pagination__control"
                    type="button"
                    [disabled]="disabled() || currentPage() <= 1"
                    [attr.aria-label]="firstAriaLabel()"
                    (click)="goToPage(1)"
                >
                    <svg
                        class="bloc-pagination__icon"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="11 17 6 12 11 7" />
                        <polyline points="18 17 13 12 18 7" />
                    </svg>
                    @if (firstLabel()) {
                        <span>{{ firstLabel() }}</span>
                    }
                </button>
            }

            <button
                class="bloc-pagination__control"
                type="button"
                [disabled]="disabled() || currentPage() <= 1"
                [attr.aria-label]="prevAriaLabel()"
                (click)="goToPage(currentPage() - 1)"
            >
                <svg
                    class="bloc-pagination__icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                @if (prevLabel()) {
                    <span>{{ prevLabel() }}</span>
                }
            </button>

            <div class="bloc-pagination__pages">
                @for (token of tokens(); track $index) {
                    @if (isNumber(token)) {
                        <button
                            class="bloc-pagination__page"
                            type="button"
                            [class.is-active]="token === currentPage()"
                            [attr.aria-current]="token === currentPage() ? 'page' : null"
                            [attr.aria-label]="'Page ' + token"
                            [disabled]="disabled()"
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
                [disabled]="disabled() || currentPage() >= normalizedTotalPages()"
                [attr.aria-label]="nextAriaLabel()"
                (click)="goToPage(currentPage() + 1)"
            >
                @if (nextLabel()) {
                    <span>{{ nextLabel() }}</span>
                }
                <svg
                    class="bloc-pagination__icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="9 6 15 12 9 18" />
                </svg>
            </button>

            @if (showFirstLast()) {
                <button
                    class="bloc-pagination__control"
                    type="button"
                    [disabled]="disabled() || currentPage() >= normalizedTotalPages()"
                    [attr.aria-label]="lastAriaLabel()"
                    (click)="goToPage(normalizedTotalPages())"
                >
                    @if (lastLabel()) {
                        <span>{{ lastLabel() }}</span>
                    }
                    <svg
                        class="bloc-pagination__icon"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                    </svg>
                </button>
            }
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
    readonly disabled = input(false);
    readonly prevLabel = input('');
    readonly nextLabel = input('');
    readonly showFirstLast = input(false);
    readonly firstLabel = input('');
    readonly lastLabel = input('');
    readonly prevAriaLabel = input('Previous page');
    readonly nextAriaLabel = input('Next page');
    readonly firstAriaLabel = input('First page');
    readonly lastAriaLabel = input('Last page');

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
        effect(() => {
            const next = this.currentPage();
            if (next !== this.page()) {
                this.page.set(next);
            }
        });
    }

    goToPage(page: number): void {
        if (this.disabled()) return;
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
        if (totalPages <= 1) return [1];

        // Fixed total slots: left boundary + left slot + window + right slot + right boundary
        const totalSlots = 2 * boundaryCount + 2 * siblingCount + 3;

        if (totalPages <= totalSlots) {
            return this._range(1, totalPages);
        }

        const leftEnd = boundaryCount; // last page of left boundary
        const rightStart = totalPages - boundaryCount + 1; // first page of right boundary

        // Ideal center window clamped to inner pages
        const winStart = Math.max(leftEnd + 2, currentPage - siblingCount);
        const winEnd = Math.min(rightStart - 2, currentPage + siblingCount);

        const leftGap = winStart - leftEnd - 1;
        const rightGap = rightStart - winEnd - 1;

        // Size of the expanded side when one ellipsis is absorbed
        const expandedSize = 2 * siblingCount + boundaryCount + 2;

        if (leftGap <= 1) {
            const left = this._range(1, expandedSize);
            const innerGap = rightStart - expandedSize - 1;
            const rt: PaginationToken = innerGap === 1 ? expandedSize + 1 : 'ellipsis';
            return [...left, rt, ...this._range(rightStart, totalPages)];
        }

        if (rightGap <= 1) {
            const rightRangeStart = totalPages - expandedSize + 1;
            const right = this._range(rightRangeStart, totalPages);
            const innerGap = rightRangeStart - leftEnd - 1;
            const lt: PaginationToken = innerGap === 1 ? leftEnd + 1 : 'ellipsis';
            return [...this._range(1, leftEnd), lt, ...right];
        }

        // Both sides have enough gap — use ellipsis (or replace with single page when gap === 1)
        const lt: PaginationToken = leftGap === 1 ? leftEnd + 1 : 'ellipsis';
        const rt: PaginationToken = rightGap === 1 ? winEnd + 1 : 'ellipsis';
        return [
            ...this._range(1, leftEnd),
            lt,
            ...this._range(winStart, winEnd),
            rt,
            ...this._range(rightStart, totalPages),
        ];
    }

    private _range(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    private _clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
