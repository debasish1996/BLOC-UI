import { Directive, input, inject, DOCUMENT } from '@angular/core';
import { BlocAutocompleteOption } from './autocomplete.component';

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

        const fuse = this._getFuseInstance(options);
        return fuse.search(term);
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

    private _getFuseInstance(options: readonly BlocAutocompleteOption<T>[]): FuseSearch<T> {
        const cfg = this.config();
        return new FuseSearch(options, {
            keys: cfg.keys ?? ['label', 'description'],
            isCaseSensitive: cfg.isCaseSensitive ?? false,
            threshold: cfg.threshold ?? 0.6,
            includeMatches: cfg.includeMatches ?? true,
            includeScore: cfg.includeScore ?? true,
            minMatchCharLength: cfg.minMatchCharLength ?? 1,
            distance: cfg.distance ?? 100,
            sortFn: cfg.sortFn,
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

/**
 * Lightweight Fuse.js-like fuzzy search implementation.
 * Provides fuzzy matching with configurable options.
 */
class FuseSearch<T = string> {
    private options: FuseSearchOptions<T>;
    private documents: readonly BlocAutocompleteOption<T>[];

    constructor(documents: readonly BlocAutocompleteOption<T>[], options: FuseSearchOptions<T>) {
        this.documents = documents;
        this.options = {
            threshold: 0.6,
            isCaseSensitive: false,
            includeMatches: true,
            includeScore: true,
            minMatchCharLength: 1,
            distance: 100,
            ...options,
        };
    }

    search(pattern: string): FuzzyMatchResult<T>[] {
        if (!pattern) {
            return this.documents.map(doc => ({
                option: doc,
                score: 0,
                matches: [],
            }));
        }

        const results: FuzzyMatchResult<T>[] = [];
        const keys = this.options.keys ?? ['label'];
        const patternLower = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();

        for (const doc of this.documents) {
            const matches: FuzzyMatchResult<T>['matches'] = [];
            let bestScore = Infinity;

            for (const key of keys) {
                const value = this._getValue(doc, key);
                if (value == null) continue;

                const text = String(value);
                const textToSearch = this.options.isCaseSensitive ? text : text.toLowerCase();

                const matchResult = this._fuzzyMatch(textToSearch, patternLower, text);

                if (matchResult.isMatch && matchResult.score !== undefined) {
                    if (matchResult.score < bestScore) {
                        bestScore = matchResult.score;
                    }

                    if (this.options.includeMatches && matchResult.indices.length > 0) {
                        matches.push({
                            key,
                            indices: matchResult.indices,
                            value: text,
                        });
                    }
                }
            }

            if (matches.length > 0 && bestScore <= (this.options.threshold ?? 0.6)) {
                results.push({
                    option: doc,
                    score: bestScore,
                    matches,
                });
            }
        }

        // Sort by score (lower is better)
        if (this.options.sortFn) {
            results.sort(this.options.sortFn);
        } else {
            results.sort((a, b) => a.score - b.score);
        }

        return results;
    }

    private _getValue(obj: BlocAutocompleteOption<T>, path: string): unknown {
        return (obj as unknown as Record<string, unknown>)[path];
    }

    private _fuzzyMatch(
        text: string,
        pattern: string,
        originalText: string,
    ): { isMatch: boolean; score: number; indices: Array<[number, number]> } {
        const m = pattern.length;
        const n = text.length;

        if (m === 0) {
            return { isMatch: true, score: 0, indices: [] };
        }

        if (m > n) {
            return { isMatch: false, score: 1, indices: [] };
        }

        // Fuzzy matching - pattern characters can appear anywhere in text
        const matchIndices: number[] = [];
        let patternIndex = 0;
        let prevMatchIndex = -1;
        let consecutiveCount = 0;
        let firstMatchIndex = -1;

        for (let textIndex = 0; textIndex < n && patternIndex < m; textIndex++) {
            if (text[textIndex] === pattern[patternIndex]) {
                matchIndices.push(textIndex);

                if (firstMatchIndex === -1) {
                    firstMatchIndex = textIndex;
                }

                // Count consecutive matches for bonus
                if (prevMatchIndex !== -1 && textIndex === prevMatchIndex + 1) {
                    consecutiveCount++;
                }

                prevMatchIndex = textIndex;
                patternIndex++;
            }
        }

        // Not all pattern characters were matched
        if (patternIndex < m) {
            return { isMatch: false, score: 1, indices: [] };
        }

        // Check minimum match character length
        const minMatchLength = this.options.minMatchCharLength ?? 1;
        if (matchIndices.length < minMatchLength) {
            return { isMatch: false, score: 1, indices: [] };
        }

        // Convert individual indices to ranges
        const indices: Array<[number, number]> = [];
        let rangeStart = matchIndices[0];
        let rangeEnd = matchIndices[0];

        for (let i = 1; i < matchIndices.length; i++) {
            if (matchIndices[i] === rangeEnd + 1) {
                // Consecutive match
                rangeEnd = matchIndices[i];
            } else {
                // Gap found, save current range and start new one
                indices.push([rangeStart, rangeEnd]);
                rangeStart = matchIndices[i];
                rangeEnd = matchIndices[i];
            }
        }
        // Don't forget the last range
        indices.push([rangeStart, rangeEnd]);

        // Calculate score (lower is better, 0 = perfect, 1 = worst)
        // Based on match density (how tightly packed the matched chars are)
        // and position (prefer matches near the start of the text).
        const span = matchIndices[matchIndices.length - 1] - matchIndices[0] + 1;
        const density = m / span; // 1.0 = all consecutive, lower = more spread out
        const densityPenalty = 1 - density;
        const positionPenalty = (firstMatchIndex / n) * 0.5;
        const consecutiveRatio = m > 1 ? consecutiveCount / (m - 1) : 0;
        const consecutiveBonus = consecutiveRatio * 0.3;

        const score = densityPenalty * 0.7 + positionPenalty - consecutiveBonus;

        return { isMatch: true, score: Math.max(0, Math.min(1, score)), indices };
    }

}

interface FuseSearchOptions<T = string> {
    keys?: string[];
    threshold?: number;
    isCaseSensitive?: boolean;
    includeMatches?: boolean;
    includeScore?: boolean;
    minMatchCharLength?: number;
    distance?: number;
    sortFn?: (a: FuzzyMatchResult<T>, b: FuzzyMatchResult<T>) => number;
}
