import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocPaginationComponent } from './pagination.component';
import { BlocPaginationModule } from './pagination.module';

async function createComponent(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
        imports: [BlocPaginationComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BlocPaginationComponent);
    // totalPages is required — default to 5 unless overridden
    fixture.componentRef.setInput('totalPages', inputs['totalPages'] ?? 5);
    for (const [key, value] of Object.entries(inputs)) {
        if (key !== 'totalPages') {
            fixture.componentRef.setInput(key, value);
        }
    }
    fixture.detectChanges();
    return fixture;
}

describe('BlocPaginationComponent', () => {
    it('should create', async () => {
        const fixture = await createComponent();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render a nav element with default aria-label', async () => {
        const fixture = await createComponent();
        const nav = (fixture.nativeElement as HTMLElement).querySelector('nav');
        expect(nav).not.toBeNull();
        expect(nav!.getAttribute('aria-label')).toBe('Pagination');
    });

    it('should show all page buttons when totalPages is small', async () => {
        const fixture = await createComponent({ totalPages: 5 });
        const pages = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__page',
        );
        expect(pages.length).toBe(5);
    });

    it('should mark page 1 as active by default', async () => {
        const fixture = await createComponent({ totalPages: 5 });
        const activePage = (fixture.nativeElement as HTMLElement).querySelector(
            '.bloc-pagination__page.is-active',
        );
        expect(activePage).not.toBeNull();
        expect(activePage!.textContent?.trim()).toBe('1');
    });

    it('should mark the correct page as active when page input is set', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 3 });
        const activePage = (fixture.nativeElement as HTMLElement).querySelector(
            '.bloc-pagination__page.is-active',
        );
        expect(activePage!.textContent?.trim()).toBe('3');
    });

    it('should set aria-current="page" on the active page button', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 2 });
        const buttons = Array.from(
            (fixture.nativeElement as HTMLElement).querySelectorAll('.bloc-pagination__page'),
        ) as HTMLButtonElement[];
        const activeBtn = buttons.find((b) => b.getAttribute('aria-current') === 'page');
        expect(activeBtn).not.toBeUndefined();
        expect(activeBtn!.textContent?.trim()).toBe('2');
    });

    it('should disable Prev button on the first page', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 1 });
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        ) as NodeListOf<HTMLButtonElement>;
        expect(controls[0].disabled).toBe(true);
    });

    it('should disable Next button on the last page', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 5 });
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        ) as NodeListOf<HTMLButtonElement>;
        expect(controls[controls.length - 1].disabled).toBe(true);
    });

    it('should navigate to the next page when Next is clicked', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 2 });
        const comp = fixture.componentInstance;
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        ) as NodeListOf<HTMLButtonElement>;
        const nextBtn = controls[controls.length - 1];
        nextBtn.click();
        fixture.detectChanges();
        expect(comp.currentPage()).toBe(3);
    });

    it('should navigate to the previous page when Prev is clicked', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 3 });
        const comp = fixture.componentInstance;
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        ) as NodeListOf<HTMLButtonElement>;
        controls[0].click();
        fixture.detectChanges();
        expect(comp.currentPage()).toBe(2);
    });

    it('should navigate to a specific page when a page button is clicked', async () => {
        const fixture = await createComponent({ totalPages: 5 });
        const comp = fixture.componentInstance;
        const pages = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__page',
        ) as NodeListOf<HTMLButtonElement>;
        pages[3].click(); // 4th button = page 4
        fixture.detectChanges();
        expect(comp.currentPage()).toBe(4);
    });

    it('should not navigate when disabled', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 3, disabled: true });
        const comp = fixture.componentInstance;
        const pages = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__page',
        ) as NodeListOf<HTMLButtonElement>;
        pages[4].click();
        fixture.detectChanges();
        expect(comp.currentPage()).toBe(3); // unchanged
    });

    it('should render ellipsis for large page counts', async () => {
        const fixture = await createComponent({ totalPages: 20, page: 10 });
        const ellipses = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__ellipsis',
        );
        expect(ellipses.length).toBeGreaterThan(0);
    });

    it('should clamp currentPage to normalizedTotalPages', async () => {
        const fixture = await createComponent({ totalPages: 5, page: 99 });
        expect(fixture.componentInstance.currentPage()).toBe(5);
    });

    it('should clamp currentPage to 1 minimum', async () => {
        const fixture = await createComponent({ totalPages: 5, page: -3 });
        expect(fixture.componentInstance.currentPage()).toBe(1);
    });

    it('should return token [1] when totalPages is 1', async () => {
        const fixture = await createComponent({ totalPages: 1 });
        expect(fixture.componentInstance.tokens()).toEqual([1]);
    });

    it('should hide First / Last buttons by default', async () => {
        const fixture = await createComponent({ totalPages: 10 });
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        );
        // default: only prev + next = 2 controls
        expect(controls.length).toBe(2);
    });

    it('should show First / Last buttons when showFirstLast is true', async () => {
        const fixture = await createComponent({ totalPages: 10, showFirstLast: true });
        const controls = (fixture.nativeElement as HTMLElement).querySelectorAll(
            '.bloc-pagination__control',
        );
        // showFirstLast=true: first + prev + next + last = 4 controls
        expect(controls.length).toBe(4);
    });

    it('isNumber should return true for a number token', async () => {
        const fixture = await createComponent();
        expect(fixture.componentInstance.isNumber(3)).toBe(true);
        expect(fixture.componentInstance.isNumber('ellipsis')).toBe(false);
    });
});

describe('BlocPaginationModule', () => {
    it('should be defined', () => {
        expect(BlocPaginationModule).toBeDefined();
    });

    it('should allow using BlocPaginationComponent via the module', async () => {
        @Component({
            template: `<bloc-pagination [totalPages]="10"></bloc-pagination>`,
            standalone: true,
            imports: [BlocPaginationModule],
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect(
            (fixture.nativeElement as HTMLElement).querySelector('bloc-pagination'),
        ).not.toBeNull();
    });
});
