import { Directive, input, inject, DOCUMENT } from '@angular/core';
import { BlocAutocompleteOption } from './autocomplete.component';
import { BlocFuzzySearch, BlocFuzzyMatch } from './fuzzy-search';

export interface FuzzyMatchResult<T = string> {
    option: BlocAutocompleteOption<T>;
    score: number;
    matches: Array<{
        key: string;
        indices: Array<[number, number]>;
        value: string;
    }>;
}

/**
 * Directive that provides fuzzy search functionality for autocomplete.
 * Apply this directive to enable fuzzy matching with configurable keys and threshold.
 *
 * @usageNotes
 * ```html
 * <bloc-autocomplete
 *   [options]="options"
 *   [blocAutocompleteFuzzySearch]="{
 *     keys: ['label', 'description'],
 *     threshold: 0.4,
 *     isCaseSensitive: false
 *   }">
 * </bloc-autocomplete>
 * ```
 */
@Directive({
    selector: '[blocAutocompleteFuzzySearch]',
    standalone: true,
})
export class BlocAutocompleteFuzzySearch<T = string> {
    private readonly _doc = inject(DOCUMENT);

    /**
     * Configuration object for fuzzy search behavior.
     * - keys: Array of property keys to search in (default: ['label'])
     * - threshold: Match threshold (0 = perfect match, 1 = match anything) (default: 0.6)
     * - isCaseSensitive: Whether matching is case sensitive (default: false)
     * - includeMatches: Whether to include match indices in results (default: true)
     * - includeScore: Whether to include score in results (default: true)
     * - minMatchCharLength: Minimum characters that must match (default: 1)
     * - distance: Maximum search distance (default: 100)
     */
    readonly config = input<{
        keys?: string[];
        threshold?: number;
        isCaseSensitive?: boolean;
        includeMatches?: boolean;
        includeScore?: boolean;
        minMatchCharLength?: number;
        distance?: number;
        sortFn?: (a: FuzzyMatchResult<T>, b: FuzzyMatchResult<T>) => number;
    }>({}, { alias: 'blocAutocompleteFuzzySearch' });

    /**
     * Performs fuzzy search on the given options with the query.
     * Returns options sorted by relevance score (best matches first).
     */
    search(options: readonly BlocAutocompleteOption<T>[], query: string): FuzzyMatchResult<T>[] {
        const term = query.trim();
        if (!term) {
            return options.map(opt => ({
                option: opt,
                score: 0,
                matches: [],
            }));
        }

        const engine = this._getFuseInstance(options);
        return engine.search(term).map(r => ({
            option: r.item,
            score: r.score,
            matches: r.matches,
        }));
    }

    /**
     * Filters options to return only those that match the fuzzy search.
     * Convenience method that matches the pattern expected by autocomplete.
     */
    filter(options: readonly BlocAutocompleteOption<T>[], query: string): BlocAutocompleteOption<T>[] {
        if (!query.trim()) {
            return options as BlocAutocompleteOption<T>[];
        }

        const results = this.search(options, query);
        const threshold = this.config().threshold ?? 0.6;

        return results
            .filter(r => r.score <= threshold)
            .map(r => r.option);
    }

    /**
     * Highlights matched portions of text based on fuzzy search results.
     * Returns HTML-safe highlighted string.
     */
    highlight(text: string, matches: Array<[number, number]>): string {
        if (!matches.length) return this._escapeHtml(text);

        let highlighted = '';
        let lastIndex = 0;

        // Sort matches by start index
        const sortedMatches = [...matches].sort((a, b) => a[0] - b[0]);
        // Merge overlapping ranges
        const mergedMatches = this._mergeRanges(sortedMatches);

        for (const [start, end] of mergedMatches) {
            highlighted += this._escapeHtml(text.slice(lastIndex, start));
            highlighted += `<mark>${this._escapeHtml(text.slice(start, end + 1))}</mark>`;
            lastIndex = end + 1;
        }

        highlighted += this._escapeHtml(text.slice(lastIndex));
        return highlighted;
    }

    private _getFuseInstance(options: readonly BlocAutocompleteOption<T>[]): BlocFuzzySearch<BlocAutocompleteOption<T>> {
        const cfg = this.config();
        return new BlocFuzzySearch(options, {
            keys: cfg.keys ?? ['label', 'description'],
            isCaseSensitive: cfg.isCaseSensitive ?? false,
            threshold: cfg.threshold ?? 0.6,
            includeMatches: cfg.includeMatches ?? true,
            includeScore: cfg.includeScore ?? true,
            minMatchCharLength: cfg.minMatchCharLength ?? 1,
            distance: cfg.distance ?? 100,
            sortFn: cfg.sortFn as ((a: BlocFuzzyMatch<BlocAutocompleteOption<T>>, b: BlocFuzzyMatch<BlocAutocompleteOption<T>>) => number) | undefined,
        });
    }

    private _mergeRanges(ranges: Array<[number, number]>): Array<[number, number]> {
        if (ranges.length === 0) return [];

        const merged: Array<[number, number]> = [ranges[0]];

        for (let i = 1; i < ranges.length; i++) {
            const last = merged[merged.length - 1];
            const current = ranges[i];

            if (current[0] <= last[1] + 1) {
                last[1] = Math.max(last[1], current[1]);
            } else {
                merged.push(current);
            }
        }

        return merged;
    }

    private _escapeHtml(text: string): string {
        const div = this._doc.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
