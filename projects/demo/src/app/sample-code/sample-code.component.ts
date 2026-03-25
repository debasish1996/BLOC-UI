import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-sample-code',
  standalone: true,
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400
             hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none p-0 mt-2"
      (click)="open.set(!open())">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
      {{ open() ? 'Hide code' : 'Show code' }}
    </button>

    @if (open()) {
      <pre
        class="mt-2 rounded-lg bg-slate-800 text-slate-200 text-xs leading-relaxed
               p-4 overflow-x-auto whitespace-pre m-0"><code>{{ code() }}</code></pre>
    }
  `,
})
export class SampleCodeComponent {
  readonly code = input.required<string>();
  readonly open = signal(false);
}
