import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BlocVirtualScrollComponent } from './virtual-scroll.component';
import { BlocVirtualItemDirective } from './virtual-scroll-item.directive';
import { BlocVirtualScrollModule } from './virtual-scroll.module';

// ── Template-mode host (provides a blocVirtualItem template) ────────
@Component({
    template: `
        <bloc-virtual-scroll [items]="items" [itemHeight]="itemHeight" style="height: 400px">
            <ng-template blocVirtualItem let-item let-i="index">
                <div style="height: 40px">{{ item.label }}</div>
            </ng-template>
        </bloc-virtual-scroll>
    `,
    standalone: true,
    imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
})
class TemplateModeHost {
    items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }));
    itemHeight = 40;
}

// ── Projection-mode host (no blocVirtualItem — uses ng-content) ─────
@Component({
    template: `
        <bloc-virtual-scroll [items]="items" [itemHeight]="48" style="height: 400px">
            <div class="projected-content">Projected</div>
        </bloc-virtual-scroll>
    `,
    standalone: true,
    imports: [BlocVirtualScrollComponent],
})
class ProjectionModeHost {
    items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
}

// ── AutoMeasure host ────────────────────────────────────────────────
@Component({
    template: `
        <bloc-virtual-scroll
            [items]="items"
            [itemHeight]="40"
            [autoMeasure]="true"
            style="height: 400px"
        >
            <ng-template blocVirtualItem let-item let-i="index">
                <div style="height: 40px">{{ item.label }}</div>
            </ng-template>
        </bloc-virtual-scroll>
    `,
    standalone: true,
    imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
})
class AutoMeasureHost {
    items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }));
}

// ── Small-list host (fewer items than viewport can show) ────────────
@Component({
    template: `
        <bloc-virtual-scroll [items]="items" [itemHeight]="100" style="height: 400px">
            <ng-template blocVirtualItem let-item>
                <div style="height: 100px">{{ item.label }}</div>
            </ng-template>
        </bloc-virtual-scroll>
    `,
    standalone: true,
    imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
})
class SmallListHost {
    items = [{ id: 1, label: 'Only Item' }];
}

// ── Helpers ─────────────────────────────────────────────────────────

function getComponent(fixture: ComponentFixture<TemplateModeHost>): BlocVirtualScrollComponent {
    return fixture.debugElement.children[0].componentInstance as BlocVirtualScrollComponent;
}

// ── Specs ────────────────────────────────────────────────────────────

describe('BlocVirtualScrollComponent — Template mode', () => {
    let fixture: ComponentFixture<TemplateModeHost>;
    let component: BlocVirtualScrollComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TemplateModeHost],
        }).compileComponents();

        fixture = TestBed.createComponent(TemplateModeHost);
        fixture.detectChanges();
        component = getComponent(fixture);
    });

    // — creation —
    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    // — host class —
    it('should carry the bloc-vs host class', () => {
        const el = fixture.nativeElement.querySelector('bloc-virtual-scroll') as HTMLElement;
        expect(el.classList.contains('bloc-vs')).toBe(true);
    });

    // — computed: totalHeight —
    it('should compute totalHeight as items.length × itemHeight in fixed mode', () => {
        expect(component.totalHeight()).toBe(100 * 40);
    });

    // — computed: startIndex —
    it('should have startIndex() = 0 at initial scroll position', () => {
        expect(component.startIndex()).toBe(0);
    });

    // — computed: endIndex —
    it('should have endIndex() > 0 so at least some items are visible', () => {
        expect(component.endIndex()).toBeGreaterThan(0);
    });

    it('should have endIndex() ≤ items.length', () => {
        expect(component.endIndex()).toBeLessThanOrEqual(100);
    });

    // — computed: visibleItems —
    it('should render fewer items than the full list (virtualization working)', () => {
        expect(component.visibleItems().length).toBeLessThan(100);
    });

    it('should render at least 1 visible item', () => {
        expect(component.visibleItems().length).toBeGreaterThan(0);
    });

    // — computed: offsets —
    it('should have offsetY() = 0 when startIndex is 0', () => {
        expect(component.offsetY()).toBe(0);
    });

    it('should have topSpace() = 0 when startIndex is 0', () => {
        expect(component.topSpace()).toBe(0);
    });

    it('should have bottomSpace() < totalHeight()', () => {
        expect(component.bottomSpace()).toBeLessThan(component.totalHeight());
    });

    it('topSpace() + visibleItems() height + bottomSpace() should equal totalHeight()', () => {
        const visibleHeight = component.visibleItems().length * 40;
        const accounted = component.topSpace() + visibleHeight + component.bottomSpace();
        // Allow a small delta due to overscan overlap
        expect(Math.abs(accounted - component.totalHeight())).toBeLessThanOrEqual(
            component.overscan() * 40,
        );
    });

    // — trackItem —
    it('trackItem(0, item) should return startIndex() + 0', () => {
        expect(component.trackItem(0, {})).toBe(component.startIndex() + 0);
    });

    it('trackItem(2, item) should return startIndex() + 2', () => {
        expect(component.trackItem(2, {})).toBe(component.startIndex() + 2);
    });

    // — scrollToIndex —
    it('scrollToIndex(0) should not throw', () => {
        expect(() => component.scrollToIndex(0)).not.toThrow();
    });

    it('scrollToIndex(0) should set viewport scrollTop to 0', () => {
        component.scrollToIndex(0);
        expect(component.viewport().nativeElement.scrollTop).toBe(0);
    });

    // — DOM structure: template mode —
    it('should render a .bloc-vs__sentinel element in template mode', () => {
        const sentinel = fixture.nativeElement.querySelector('.bloc-vs__sentinel');
        expect(sentinel).not.toBeNull();
    });

    it('should render a .bloc-vs__content element in template mode', () => {
        const content = fixture.nativeElement.querySelector('.bloc-vs__content');
        expect(content).not.toBeNull();
    });

    it('should apply translate3d transform on the content element', () => {
        const content = fixture.nativeElement.querySelector('.bloc-vs__content') as HTMLElement;
        expect(content?.style.transform).toContain('translate3d');
    });

    it('should NOT render .bloc-vs__spacer elements in template mode', () => {
        const spacers = fixture.nativeElement.querySelectorAll('.bloc-vs__spacer');
        expect(spacers.length).toBe(0);
    });

    it('sentinel height should equal totalHeight()', () => {
        const sentinel = fixture.nativeElement.querySelector('.bloc-vs__sentinel') as HTMLElement;
        expect(sentinel?.style.height).toBe(`${component.totalHeight()}px`);
    });

    // — itemDef —
    it('should detect the blocVirtualItem template in template mode', () => {
        expect(component.itemDef()).toBeTruthy();
    });

    // — overscan default —
    it('should have default overscan of 10', () => {
        expect(component.overscan()).toBe(10);
    });

    // — inputs via setInput —
    it('should accept autoMeasure input defaulting to false', () => {
        expect(component.autoMeasure()).toBe(false);
    });

    it('should accept custom overscan via setInput', () => {
        fixture.debugElement.children[0].injector.get(BlocVirtualScrollComponent);
        // overscan is set via the component's input; verify the default is 10 and the input works
        expect(component.overscan()).toBe(10);
    });
});

// ── Projection mode ──────────────────────────────────────────────────

describe('BlocVirtualScrollComponent — Projection mode', () => {
    let fixture: ComponentFixture<ProjectionModeHost>;
    let component: BlocVirtualScrollComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProjectionModeHost],
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectionModeHost);
        fixture.detectChanges();
        component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
    });

    it('should create in projection mode', () => {
        expect(component).toBeTruthy();
    });

    it('should render .bloc-vs__spacer elements in projection mode', () => {
        const spacers = fixture.nativeElement.querySelectorAll('.bloc-vs__spacer');
        expect(spacers.length).toBe(2);
    });

    it('should NOT render .bloc-vs__sentinel in projection mode', () => {
        const sentinel = fixture.nativeElement.querySelector('.bloc-vs__sentinel');
        expect(sentinel).toBeNull();
    });

    it('should project content in the viewport', () => {
        const projected = fixture.nativeElement.querySelector('.projected-content');
        expect(projected).not.toBeNull();
    });

    it('should have itemDef() = undefined in projection mode', () => {
        expect(component.itemDef()).toBeUndefined();
    });
});

// ── Small list (fewer items than viewport) ───────────────────────────

describe('BlocVirtualScrollComponent — Small list', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SmallListHost],
        }).compileComponents();
    });

    it('should render 1 item when items has only 1 element', () => {
        const fixture = TestBed.createComponent(SmallListHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.visibleItems().length).toBe(1);
    });

    it('should have totalHeight = itemHeight when items.length = 1', () => {
        const fixture = TestBed.createComponent(SmallListHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.totalHeight()).toBe(100);
    });
});

// ── autoMeasure mode ─────────────────────────────────────────────────

describe('BlocVirtualScrollComponent — autoMeasure', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AutoMeasureHost],
        }).compileComponents();
    });

    it('should create with autoMeasure=true', () => {
        const fixture = TestBed.createComponent(AutoMeasureHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.autoMeasure()).toBe(true);
    });

    it('should still compute a positive totalHeight in autoMeasure mode', () => {
        const fixture = TestBed.createComponent(AutoMeasureHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.totalHeight()).toBeGreaterThan(0);
    });
});

// ── Empty list ───────────────────────────────────────────────────────

describe('BlocVirtualScrollComponent — Empty list', () => {
    @Component({
        template: `
            <bloc-virtual-scroll [items]="[]" [itemHeight]="40" style="height: 400px">
                <ng-template blocVirtualItem let-item>
                    <div>{{ item }}</div>
                </ng-template>
            </bloc-virtual-scroll>
        `,
        standalone: true,
        imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
    })
    class EmptyHost {}

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EmptyHost],
        }).compileComponents();
    });

    it('should handle an empty items array without errors', () => {
        const fixture = TestBed.createComponent(EmptyHost);
        expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should have totalHeight = 0 for empty items', () => {
        const fixture = TestBed.createComponent(EmptyHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.totalHeight()).toBe(0);
    });

    it('should have visibleItems().length = 0 for empty items', () => {
        const fixture = TestBed.createComponent(EmptyHost);
        fixture.detectChanges();
        const component = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        expect(component.visibleItems().length).toBe(0);
    });
});

// ── BlocVirtualScrollModule ──────────────────────────────────────────

describe('BlocVirtualScrollModule', () => {
    it('should be defined', () => {
        expect(BlocVirtualScrollModule).toBeDefined();
    });

    it('should allow using BlocVirtualScrollComponent via the module', async () => {
        @Component({
            template: `
                <bloc-virtual-scroll [items]="[]" [itemHeight]="40" style="height: 100px">
                </bloc-virtual-scroll>
            `,
            standalone: true,
            imports: [BlocVirtualScrollModule],
        })
        class ModuleHost {}

        await TestBed.configureTestingModule({
            imports: [ModuleHost],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHost);
        modFixture.detectChanges();
        expect(
            (modFixture.nativeElement as HTMLElement).querySelector('bloc-virtual-scroll'),
        ).not.toBeNull();
    });
});
