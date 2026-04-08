import { DOCUMENT } from '@angular/common';
import { Directive, computed, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

const TEXT_HIGHLIGHT_CSS = [
    '@layer bloc-text-highlight{',
    ':where(.bloc-text-highlight__match){',
    'background:var(--bloc-text-highlight-bg,transparent);',
    'color:var(--bloc-text-highlight-color,inherit);',
    'border-radius:var(--bloc-text-highlight-radius,2px);',
    'padding:var(--bloc-text-highlight-padding,0);',
    'font-weight:var(--bloc-text-highlight-font-weight,700);}',
    ':where(.bloc-text-highlight__match--highlighted){',
    '--bloc-text-highlight-bg:#fef08a;',
    'padding:var(--bloc-text-highlight-padding,0 2px);}',
    '}',
].join('');

function ensureTextHighlightStyles(doc: Document): void {
    if (!doc?.head || doc.head.hasAttribute('data-bloc-text-highlight-styles')) return;
    const style = doc.createElement('style');
    style.textContent = TEXT_HIGHLIGHT_CSS;
    doc.head.setAttribute('data-bloc-text-highlight-styles', '');
    doc.head.appendChild(style);
}

@Directive({
    selector: '[blocTextHighlight]',
    standalone: true,
    host: {
        class: 'bloc-text-highlight',
    },
})
export class BlocTextHighlightDirective {
    private readonly doc = inject(DOCUMENT);
    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);

    /** The full text to display. */
    readonly blocTextHighlight = input.required<string>();

    /** The search term to highlight within the text. */
    readonly query = input<string>('');

    /** Whether matching should be case-sensitive. Defaults to false. */
    readonly caseSensitive = input<boolean>(false);

    /** When true, applies a background highlight class to matched text. */
    readonly highlighted = input<boolean>(false);

    private readonly html = computed(() => {
        const text = this.blocTextHighlight();
        const query = this.query();

        if (!query || !text) {
            return this.escapeHtml(text ?? '');
        }

        const flags = this.caseSensitive() ? 'g' : 'gi';
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, flags);

        const highlightClass = this.highlighted()
            ? 'bloc-text-highlight__match bloc-text-highlight__match--highlighted'
            : 'bloc-text-highlight__match';

        const parts: string[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(this.escapeHtml(text.slice(lastIndex, match.index)));
            }
            parts.push(`<mark class="${highlightClass}">${this.escapeHtml(match[0])}</mark>`);
            lastIndex = regex.lastIndex;
            if (match[0].length === 0) {
                regex.lastIndex++;
            }
        }

        if (lastIndex < text.length) {
            parts.push(this.escapeHtml(text.slice(lastIndex)));
        }

        return parts.join('');
    });

    constructor() {
        ensureTextHighlightStyles(this.doc);
        effect(() => {
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.html());
        });
    }

    private escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
