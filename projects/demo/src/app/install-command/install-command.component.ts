import { Component, input, signal } from '@angular/core';

@Component({
    selector: 'app-install-command',
    standalone: true,
    template: `
        <div
            class="mt-3 inline-flex items-center gap-2 bg-slate-800 text-slate-200 font-mono text-xs px-4 py-2.5 rounded-lg shadow-inner"
        >
            <span>
                <span class="text-slate-500 select-none">$ </span>npm install
                <span class="text-blue-400 font-semibold">{{ package() }}</span>
            </span>
            <button
                (click)="copy()"
                class="ml-2 p-1 rounded hover:bg-slate-700 transition-colors text-slate-400 hover:text-white cursor-pointer bg-transparent border-none outline-none"
                [attr.aria-label]="copied() ? 'Copied!' : 'Copy to clipboard'"
            >
                @if (copied()) {
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                } @else {
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                }
            </button>
        </div>
    `,
})
export class InstallCommandComponent {
    readonly package = input.required<string>();
    readonly copied = signal(false);

    copy(): void {
        navigator.clipboard.writeText(`npm install ${this.package()}`);
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
    }
}
