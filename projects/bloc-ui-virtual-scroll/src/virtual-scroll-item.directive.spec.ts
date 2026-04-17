import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef } from '@angular/core';
import { BlocVirtualItemDirective, BlocVirtualItemContext } from './virtual-scroll-item.directive';
import { BlocVirtualScrollComponent } from './virtual-scroll.component';
import { BlocVirtualScrollModule } from './virtual-scroll.module';

// ── Host that uses the directive ────────────────────────────────────
@Component({
    template: `
        <bloc-virtual-scroll [items]="items" [itemHeight]="40" style="height: 200px">
            <ng-template blocVirtualItem let-item let-i="index">
                <div class="item-row">{{ item.label }}</div>
            </ng-template>
        </bloc-virtual-scroll>
    `,
    standalone: true,
    imports: [BlocVirtualScrollComponent, BlocVirtualItemDirective],
})
class DirectiveHost {
    items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, label: `Item ${i + 1}` }));
}

// ── Spec ─────────────────────────────────────────────────────────────

describe('BlocVirtualItemDirective', () => {
    let fixture: ComponentFixture<DirectiveHost>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DirectiveHost],
        }).compileComponents();

        fixture = TestBed.createComponent(DirectiveHost);
        fixture.detectChanges();
    });

    it('should be defined', () => {
        expect(BlocVirtualItemDirective).toBeDefined();
    });

    it('should create when used inside a bloc-virtual-scroll', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    // — Integration: items are rendered via the directive —
    it('should render visible item rows via the directive template', () => {
        const rows = fixture.nativeElement.querySelectorAll('.item-row');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('should render fewer rows than total items (virtualization)', () => {
        const rows = fixture.nativeElement.querySelectorAll('.item-row');
        expect(rows.length).toBeLessThan(100);
    });

    it('should render first item label in the DOM', () => {
        const firstRow = fixture.nativeElement.querySelector('.item-row');
        expect(firstRow?.textContent?.trim()).toBeTruthy();
    });

    // — templateRef is injected —
    it('should have templateRef injected (accessible via contentChild)', () => {
        const vsComponent = fixture.debugElement.children[0]
            .componentInstance as BlocVirtualScrollComponent;
        const itemDef = vsComponent.itemDef();
        expect(itemDef).toBeTruthy();
        expect(itemDef?.templateRef).toBeInstanceOf(TemplateRef);
    });
});

// ── BlocVirtualItemContext type ──────────────────────────────────────

describe('BlocVirtualItemContext', () => {
    it('should have correct shape with $implicit and index', () => {
        const ctx: BlocVirtualItemContext<string> = {
            $implicit: 'hello',
            index: 0,
        };
        expect(ctx.$implicit).toBe('hello');
        expect(ctx.index).toBe(0);
    });

    it('should support generic type parameter', () => {
        interface Item {
            id: number;
            label: string;
        }
        const ctx: BlocVirtualItemContext<Item> = {
            $implicit: { id: 1, label: 'Test' },
            index: 5,
        };
        expect(ctx.$implicit.id).toBe(1);
        expect(ctx.index).toBe(5);
    });
});

// ── Via module ───────────────────────────────────────────────────────

describe('BlocVirtualItemDirective via BlocVirtualScrollModule', () => {
    it('should be usable via BlocVirtualScrollModule', async () => {
        @Component({
            template: `
                <bloc-virtual-scroll [items]="items" [itemHeight]="40" style="height: 200px">
                    <ng-template blocVirtualItem let-item>
                        <div class="module-item">{{ item.label }}</div>
                    </ng-template>
                </bloc-virtual-scroll>
            `,
            standalone: true,
            imports: [BlocVirtualScrollModule],
        })
        class ModuleHost {
            items = [{ label: 'A' }, { label: 'B' }];
        }

        await TestBed.configureTestingModule({
            imports: [ModuleHost],
        }).compileComponents();

        const modFixture = TestBed.createComponent(ModuleHost);
        modFixture.detectChanges();

        const items = modFixture.nativeElement.querySelectorAll('.module-item');
        expect(items.length).toBeGreaterThan(0);
    });
});
