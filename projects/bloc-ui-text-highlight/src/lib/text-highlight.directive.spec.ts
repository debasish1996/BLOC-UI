import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BlocTextHighlightDirective } from './text-highlight.directive';
import { BlocTextHighlightModule } from './text-highlight.module';

@Component({
    imports: [BlocTextHighlightDirective],
    template: `<span
        [blocTextHighlight]="text"
        [query]="query"
        [highlighted]="highlighted"
    ></span>`,
})
class TestHost {
    text = 'Hello World';
    query = '';
    highlighted = false;
}

describe('BlocTextHighlightDirective', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHost],
        }).compileComponents();
    });

    it('should create the directive', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span');
        expect(span).toBeTruthy();
    });

    it('should render plain text when query is empty', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span') as HTMLElement;
        expect(span.textContent).toBe('Hello World');
        expect(span.querySelector('mark')).toBeNull();
    });

    it('should wrap matching text in <mark> tags', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.query = 'World';
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark).toBeTruthy();
        expect(mark.textContent).toBe('World');
        expect(mark.classList.contains('bloc-text-highlight__match')).toBe(true);
    });

    it('should add highlighted class when highlighted=true', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.query = 'Hello';
        fixture.componentInstance.highlighted = true;
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark.classList.contains('bloc-text-highlight__match--highlighted')).toBe(true);
    });

    it('should be case-insensitive by default', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.query = 'hello';
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark).toBeTruthy();
        expect(mark.textContent).toBe('Hello');
    });
});

describe('BlocTextHighlightModule', () => {
    it('should allow using the directive via the module', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocTextHighlightModule, TestHost],
        }).compileComponents();

        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('span')).toBeTruthy();
    });
});
