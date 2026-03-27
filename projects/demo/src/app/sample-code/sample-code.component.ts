import { Component, input, signal, ElementRef, viewChild } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
    selector: 'app-sample-code',
    standalone: true,
    imports: [Highlight],
    styles: `
        :host {
            display: block;
        }
        .code-wrapper {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 300ms ease-in-out;
        }
        .code-wrapper.is-open {
            grid-template-rows: 1fr;
        }
        .code-inner {
            overflow: hidden;
        }
        .code-container {
            position: relative;
            margin-top: 0.75rem;
            background: #0d1117;
            border-radius: 0.75rem;
            padding: 1rem;
        }
        .scroll-anchor {
            height: 0;
        }
        pre {
            margin: 0 !important;
            padding: 0.75rem !important;
            border-radius: 0 !important;
            font-size: 1rem !important;
            line-height: 1.8 !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow: hidden !important;
            background: transparent !important;
        }
        .copy-btn {
            position: absolute;
            top: 0.625rem;
            right: 0.625rem;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.85);
            color: #475569;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition:
                background 200ms,
                color 200ms;
            z-index: 1;
        }
        .copy-btn:hover {
            background: rgba(255, 255, 255, 1);
            color: #1e293b;
        }
        .copy-btn.copied {
            color: #4ade80;
        }
    `,
    template: `
        <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400
             hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none p-0 mt-2"
            (click)="toggle()"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
            {{ open() ? 'Hide code' : 'Show code' }}
        </button>

        <div class="code-wrapper" [class.is-open]="open()" #wrapper>
            <div class="code-inner">
                <div class="code-container" #codeBlock>
                    <button
                        class="copy-btn"
                        [class.copied]="copied()"
                        (click)="copyCode()"
                        type="button"
                        title="Copy code"
                    >
                        @if (copied()) {
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        } @else {
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        }
                    </button>
                    <pre><code [highlight]="code()" [language]="language()"></code></pre>
                </div>
                <div class="scroll-anchor" #scrollAnchor></div>
            </div>
        </div>
    `,
})
export class SampleCodeComponent {
    readonly code = input.required<string>();
    readonly language = input<string>('xml');
    readonly open = signal(false);
    readonly copied = signal(false);

    private readonly wrapper = viewChild<ElementRef>('wrapper');
    private readonly scrollAnchor = viewChild<ElementRef>('scrollAnchor');

    toggle(): void {
        const opening = !this.open();
        this.open.set(opening);
        if (opening) {
            const el = this.wrapper()?.nativeElement as HTMLElement | undefined;
            if (el) {
                const onEnd = () => {
                    el.removeEventListener('transitionend', onEnd);
                    this.scrollAnchor()?.nativeElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                };
                el.addEventListener('transitionend', onEnd);
            }
        }
    }

    copyCode(): void {
        navigator.clipboard.writeText(this.code());
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
    }
}
