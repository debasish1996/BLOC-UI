import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BlocAccordionComponent } from './accordion.component';
import { BlocAccordionContentDirective } from './accordion-content.directive';
import { BlocAccordionItemDirective } from './accordion-item.directive';
import { BlocAccordionModule } from './accordion.module';
import { BlocAccordionTriggerDirective } from './accordion-trigger.directive';

@Component({
    standalone: true,
    imports: [
        BlocAccordionComponent,
        BlocAccordionItemDirective,
        BlocAccordionTriggerDirective,
        BlocAccordionContentDirective,
    ],
    template: `
        <bloc-accordion [multi]="multi">
            <div blocAccordionItem [expanded]="firstExpanded" [disabled]="firstDisabled">
                <button blocAccordionTrigger>Item 1</button>
                <div blocAccordionContent>Content 1</div>
            </div>
            <div blocAccordionItem [expanded]="secondExpanded">
                <button blocAccordionTrigger>Item 2</button>
                <div blocAccordionContent>Content 2</div>
            </div>
            <div blocAccordionItem>
                <button blocAccordionTrigger>Item 3</button>
                <div blocAccordionContent>Content 3</div>
            </div>
        </bloc-accordion>
    `,
})
class HostComponent {
    multi = false;
    firstExpanded = false;
    firstDisabled = false;
    secondExpanded = false;
}

describe('BlocAccordionComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();
    });

    it('should create and render the accordion', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const accordion = fixture.nativeElement.querySelector('bloc-accordion') as HTMLElement;
        expect(accordion).toBeTruthy();
        expect(accordion.classList.contains('bloc-accordion')).toBe(true);
    });

    it('should render three accordion items', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const items = fixture.nativeElement.querySelectorAll('[bloAccordionItem], .bloc-accordion-item');
        expect(fixture.nativeElement.querySelectorAll('.bloc-accordion-item').length).toBe(3);
    });

    it('panels are hidden when items are collapsed', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        // All items start collapsed — every panel should have hidden attribute
        panels.forEach((panel) => {
            expect(panel.hasAttribute('hidden')).toBe(true);
        });
    });

    it('panel becomes visible when item is expanded', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.firstExpanded = true;
        fixture.detectChanges();
        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        expect(panels[0].hasAttribute('hidden')).toBe(false);
        expect(panels[1].hasAttribute('hidden')).toBe(true);
    });

    it('trigger has aria-expanded reflecting item state', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.firstExpanded = true;
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;
        expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
        expect(triggers[1].getAttribute('aria-expanded')).toBe('false');
    });

    it('clicking a trigger toggles its item open', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;
        triggers[0].click();
        fixture.detectChanges();
        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        expect(panels[0].hasAttribute('hidden')).toBe(false);
    });

    it('single mode: opening one item collapses others', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;

        triggers[0].click();
        fixture.detectChanges();
        triggers[1].click();
        fixture.detectChanges();

        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        expect(panels[0].hasAttribute('hidden')).toBe(true);
        expect(panels[1].hasAttribute('hidden')).toBe(false);
    });

    it('multi mode: multiple items can be open simultaneously', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.multi = true;
        fixture.detectChanges();

        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;
        triggers[0].click();
        fixture.detectChanges();
        triggers[1].click();
        fixture.detectChanges();

        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        expect(panels[0].hasAttribute('hidden')).toBe(false);
        expect(panels[1].hasAttribute('hidden')).toBe(false);
    });

    it('disabled item trigger cannot be toggled', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.firstDisabled = true;
        fixture.detectChanges();

        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;
        triggers[0].click();
        fixture.detectChanges();

        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        expect(panels[0].hasAttribute('hidden')).toBe(true);
    });

    it('disabled trigger has disabled attribute', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.firstDisabled = true;
        fixture.detectChanges();

        const triggers = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-trigger',
        ) as NodeListOf<HTMLElement>;
        expect(triggers[0].hasAttribute('disabled')).toBe(true);
    });

    it('trigger has aria-controls pointing to panel id', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector(
            '.bloc-accordion-trigger',
        ) as HTMLElement;
        const panel = fixture.nativeElement.querySelector('.bloc-accordion-panel') as HTMLElement;
        expect(trigger.getAttribute('aria-controls')).toBeTruthy();
        expect(trigger.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
    });

    it('panel has role="region" and aria-labelledby pointing to trigger id', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
        const trigger = fixture.nativeElement.querySelector(
            '.bloc-accordion-trigger',
        ) as HTMLElement;
        const panel = fixture.nativeElement.querySelector('.bloc-accordion-panel') as HTMLElement;
        expect(panel.getAttribute('role')).toBe('region');
        expect(panel.getAttribute('aria-labelledby')).toBe(trigger.getAttribute('id'));
    });

    it('single mode: normalizes to at most one open item on init', () => {
        const fixture = TestBed.createComponent(HostComponent);
        fixture.componentInstance.firstExpanded = true;
        fixture.componentInstance.secondExpanded = true;
        fixture.detectChanges();

        const panels = fixture.nativeElement.querySelectorAll(
            '.bloc-accordion-panel',
        ) as NodeListOf<HTMLElement>;
        const openCount = Array.from(panels).filter((p) => !p.hasAttribute('hidden')).length;
        expect(openCount).toBe(1);
    });
});

describe('BlocAccordionModule', () => {
    it('should be defined', () => {
        expect(BlocAccordionModule).toBeDefined();
    });

    it('should allow using accordion directives via the module', async () => {
        @Component({
            standalone: true,
            imports: [BlocAccordionModule],
            template: `
                <bloc-accordion>
                    <div blocAccordionItem>
                        <button blocAccordionTrigger>Item</button>
                        <div blocAccordionContent>Content</div>
                    </div>
                </bloc-accordion>
            `,
        })
        class ModuleHostComponent {}

        await TestBed.configureTestingModule({
            imports: [ModuleHostComponent],
        }).compileComponents();

        const fixture = TestBed.createComponent(ModuleHostComponent);
        fixture.detectChanges();
        expect(
            (fixture.nativeElement as HTMLElement).querySelector('bloc-accordion'),
        ).not.toBeNull();
    });
});
