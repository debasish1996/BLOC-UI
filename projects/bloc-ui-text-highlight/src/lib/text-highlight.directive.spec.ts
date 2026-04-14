import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BlocTextHighlightDirective } from './text-highlight.directive';
import { BlocTextHighlightModule } from './text-highlight.module';

@Component({
    imports: [BlocTextHighlightDirective],
    template: `<span
        [blocTextHighlight]="text"
        [query]="query"
        [caseSensitive]="caseSensitive"
        [highlighted]="highlighted"
    ></span>`,
})
class TestHost {
    text = 'Hello World';
    query = '';
    caseSensitive = false;
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

    it('should not add highlighted class when highlighted=false', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.query = 'Hello';
        fixture.componentInstance.highlighted = false;
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark.classList.contains('bloc-text-highlight__match')).toBe(true);
        expect(mark.classList.contains('bloc-text-highlight__match--highlighted')).toBe(false);
    });

    it('should be case-insensitive by default', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.query = 'hello';
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark).toBeTruthy();
        expect(mark.textContent).toBe('Hello');
    });

    it('should respect caseSensitive=true and skip non-matching case', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = 'Apple Application';
        fixture.componentInstance.query = 'app';
        fixture.componentInstance.caseSensitive = true;
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span') as HTMLElement;
        // "app" should not match "App" when case-sensitive
        expect(span.querySelector('mark')).toBeNull();
        expect(span.textContent).toBe('Apple Application');
    });

    it('should match exact case when caseSensitive=true', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = 'Apple application';
        fixture.componentInstance.query = 'app';
        fixture.componentInstance.caseSensitive = true;
        fixture.detectChanges();
        const marks = fixture.nativeElement.querySelectorAll('mark');
        expect(marks.length).toBe(1);
        expect(marks[0].textContent).toBe('app');
    });

    it('should highlight multiple matches in the same text', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = 'Apple Application Pineapple';
        fixture.componentInstance.query = 'App';
        fixture.detectChanges();
        const marks = fixture.nativeElement.querySelectorAll('mark');
        // case-insensitive: "App" in Apple, "App" in Application, "app" in Pineapple
        expect(marks.length).toBe(3);
    });

    it('should render empty string without error when text is empty', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = '';
        fixture.componentInstance.query = 'test';
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span') as HTMLElement;
        expect(span.textContent).toBe('');
        expect(span.querySelector('mark')).toBeNull();
    });

    it('should escape special regex characters in query', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = 'Price is $100.00 (USD)';
        fixture.componentInstance.query = '$100.00';
        fixture.detectChanges();
        const mark = fixture.nativeElement.querySelector('mark');
        expect(mark).toBeTruthy();
        expect(mark.textContent).toBe('$100.00');
    });

    it('should escape HTML entities in rendered text', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = '<script>alert("xss")</script>';
        fixture.componentInstance.query = 'script';
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span') as HTMLElement;
        // Must not inject raw HTML — the angle brackets should be escaped
        expect(span.querySelector('script')).toBeNull();
        const marks = span.querySelectorAll('mark');
        expect(marks.length).toBe(2);
        expect(marks[0].textContent).toBe('script');
    });

    it('should render full text when query has no match', () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.text = 'Banana';
        fixture.componentInstance.query = 'xyz';
        fixture.detectChanges();
        const span = fixture.nativeElement.querySelector('span') as HTMLElement;
        expect(span.textContent).toBe('Banana');
        expect(span.querySelector('mark')).toBeNull();
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
