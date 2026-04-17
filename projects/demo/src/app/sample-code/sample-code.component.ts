import { Component, computed, input, signal, ElementRef, viewChild } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { BlocTabGroupComponent, BlocTabComponent } from '@bloc-ui/tab';

export interface CodeFile {
    label: string;
    language: string;
    code: string;
}

@Component({
    selector: 'app-sample-code',
    standalone: true,
    imports: [Highlight, BlocTabGroupComponent, BlocTabComponent],
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
        .code-block {
            margin-top: 0.75rem;
            border-radius: 0.75rem;
            overflow: hidden;
            background: #0d1117;
        }
        .code-tabs {
            --bloc-tab-body-padding: 0;
            --bloc-tab-padding: 6px 16px;
            --bloc-tab-font-size: 0.8125rem;
            --bloc-tab-color: #8b949e;
            --bloc-tab-hover-color: #c9d1d9;
            --bloc-tab-active-color: #e6edf3;
            --bloc-tab-indicator: #f0f6fc;
            --bloc-tab-border: #30363d;
            --bloc-tab-focus-ring: #58a6ff;
            background: #161b22;
        }
        .code-container {
            position: relative;
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
            background: rgba(255, 255, 255, 0.1);
            color: #9ca3af;
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
            background: rgba(255, 255, 255, 0.2);
            color: #e5e7eb;
        }
        .copy-btn.copied {
            color: #4ade80;
        }
    `,
    template: `
        <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500
             hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-none p-0 mt-2"
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
                @if (files().length) {
                    <div class="code-block">
                        @if (files().length > 1) {
                            <bloc-tab-group
                                class="code-tabs"
                                (selectedIndexChange)="onTabChange($event)"
                            >
                                @for (file of files(); track file.label) {
                                    <bloc-tab [label]="file.label"></bloc-tab>
                                }
                            </bloc-tab-group>
                        }
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
                                        <path
                                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                        />
                                    </svg>
                                }
                            </button>
                            <pre><code [highlight]="activeFile().code" [language]="activeFile().language"></code></pre>
                        </div>
                    </div>
                }
                <div class="scroll-anchor" #scrollAnchor></div>
            </div>
        </div>
    `,
})
export class SampleCodeComponent {
    readonly files = input<CodeFile[]>([]);
    readonly open = signal(false);
    readonly copied = signal(false);
    readonly activeIndex = signal(0);

    private readonly wrapper = viewChild<ElementRef>('wrapper');
    private readonly scrollAnchor = viewChild<ElementRef>('scrollAnchor');

    readonly activeFile = computed(() => {
        const files = this.files();
        return files[this.activeIndex()] ?? files[0] ?? { label: '', language: 'xml', code: '' };
    });

    onTabChange(index: number): void {
        this.activeIndex.set(index);
        this.copied.set(false);
    }

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
        const file = this.activeFile();
        if (file) {
            navigator.clipboard.writeText(file.code);
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        }
    }
}
