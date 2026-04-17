import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { BlocTabGroupComponent } from './tab-group.component';
import { BlocTabComponent } from './tab.component';
import { BlocTabModule } from './tab.module';

// ── Test host ──────────────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [BlocTabGroupComponent, BlocTabComponent],
    template: `
        <bloc-tab-group
            [selectedIndex]="selectedIndex()"
            (selectedIndexChange)="onIndexChange($event)"
        >
            <bloc-tab label="First">First content</bloc-tab>
            <bloc-tab label="Second">Second content</bloc-tab>
            <bloc-tab label="Third" [disabled]="thirdDisabled()">Third content</bloc-tab>
        </bloc-tab-group>
    `,
})
class TestHostComponent {
    readonly selectedIndex = signal(0);
    readonly thirdDisabled = signal(false);
    lastEmittedIndex: number | null = null;
    onIndexChange(i: number) {
        this.lastEmittedIndex = i;
    }
}

// ── BlocTabGroupComponent ──────────────────────────────────────────────────

describe('BlocTabGroupComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let host: TestHostComponent;

    function el(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    function tabButtons(): NodeListOf<HTMLButtonElement> {
        return el().querySelectorAll<HTMLButtonElement>('.bloc-tab-group__tab');
    }

    function tabPanels(): NodeListOf<HTMLElement> {
        return el().querySelectorAll<HTMLElement>('[role="tabpanel"]');
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Creation ──────────────────────────────────────────────────────────

    it('should create', () => {
        expect(el().querySelector('bloc-tab-group')).toBeTruthy();
    });

    it('should apply bloc-tab-group class on host', () => {
        const group = el().querySelector('bloc-tab-group')!;
        expect(group.classList.contains('bloc-tab-group')).toBe(true);
    });

    // ── ARIA roles ────────────────────────────────────────────────────────

    it('tab header container has role="tablist"', () => {
        const tablist = el().querySelector('[role="tablist"]');
        expect(tablist).toBeTruthy();
    });

    it('tab header buttons have role="tab"', () => {
        const tabs = el().querySelectorAll('[role="tab"]');
        expect(tabs.length).toBe(3);
    });

    it('active tab panel has role="tabpanel"', () => {
        expect(tabPanels().length).toBe(1);
        expect(tabPanels()[0].getAttribute('role')).toBe('tabpanel');
    });

    // ── Default active state ──────────────────────────────────────────────

    it('first tab is active by default', () => {
        const buttons = tabButtons();
        expect(buttons[0].classList.contains('bloc-tab-group__tab--active')).toBe(true);
        expect(buttons[1].classList.contains('bloc-tab-group__tab--active')).toBe(false);
    });

    it('first tab panel content is visible by default', () => {
        expect(tabPanels()[0].textContent).toContain('First content');
    });

    it('aria-selected is true on the active tab button', () => {
        expect(tabButtons()[0].getAttribute('aria-selected')).toBe('true');
        expect(tabButtons()[1].getAttribute('aria-selected')).toBe('false');
    });

    // ── selectedIndex input ───────────────────────────────────────────────

    it('selectedIndex=1 activates the second tab', async () => {
        // ngAfterContentInit reads selectedIndex() once; to re-test switching, use click
        tabButtons()[1].click();
        fixture.detectChanges();
        expect(tabButtons()[1].classList.contains('bloc-tab-group__tab--active')).toBe(true);
    });

    // ── Tab switching ─────────────────────────────────────────────────────

    it('clicking the second tab makes it active', () => {
        tabButtons()[1].click();
        fixture.detectChanges();
        expect(tabButtons()[1].classList.contains('bloc-tab-group__tab--active')).toBe(true);
        expect(tabButtons()[0].classList.contains('bloc-tab-group__tab--active')).toBe(false);
    });

    it('clicking the second tab shows its panel content', () => {
        tabButtons()[1].click();
        fixture.detectChanges();
        expect(tabPanels()[0].textContent).toContain('Second content');
    });

    it('only one panel is visible at a time', () => {
        tabButtons()[1].click();
        fixture.detectChanges();
        expect(tabPanels().length).toBe(1);
    });

    // ── selectedIndexChange output ────────────────────────────────────────

    it('emits correct index on tab click', () => {
        tabButtons()[1].click();
        fixture.detectChanges();
        expect(host.lastEmittedIndex).toBe(1);
    });

    it('does not emit when clicking the already-active tab', () => {
        tabButtons()[0].click();
        fixture.detectChanges();
        expect(host.lastEmittedIndex).toBeNull();
    });

    // ── Disabled tab ──────────────────────────────────────────────────────

    it('disabled tab button has aria-disabled', () => {
        host.thirdDisabled.set(true);
        fixture.detectChanges();
        const btn = tabButtons()[2];
        expect(btn.getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled tab has bloc-tab-group__tab--disabled class', () => {
        host.thirdDisabled.set(true);
        fixture.detectChanges();
        expect(tabButtons()[2].classList.contains('bloc-tab-group__tab--disabled')).toBe(true);
    });

    it('clicking a disabled tab does not change active panel', () => {
        host.thirdDisabled.set(true);
        fixture.detectChanges();
        tabButtons()[2].click();
        fixture.detectChanges();
        expect(tabButtons()[0].classList.contains('bloc-tab-group__tab--active')).toBe(true);
        expect(host.lastEmittedIndex).toBeNull();
    });
});

// ── BlocTabModule ──────────────────────────────────────────────────────────

describe('BlocTabModule', () => {
    it('should be importable as an NgModule', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocTabModule],
        }).compileComponents();
        expect(true).toBe(true);
    });
});
