/**
 * Generic fuzzy search result.
 */
export interface BlocFuzzyMatch<T> {
    item: T;
    score: number;
    matches: Array<{
        key: string;
        indices: Array<[number, number]>;
        value: string;
    }>;
}

/**
 * Configuration options for `BlocFuzzySearch`.
 */
export interface BlocFuzzySearchOptions<T> {
    keys?: string[];
    threshold?: number;
    isCaseSensitive?: boolean;
    includeMatches?: boolean;
    includeScore?: boolean;
    minMatchCharLength?: number;
    distance?: number;
    sortFn?: (a: BlocFuzzyMatch<T>, b: BlocFuzzyMatch<T>) => number;
}

/**
 * Lightweight fuzzy search engine that works with any object type.
 *
 * @usageNotes
 * ```ts
 * const engine = new BlocFuzzySearch(items, { keys: ['name'], threshold: 0.5 });
 * const results = engine.search('query');
 * ```
 */
export class BlocFuzzySearch<T> {
    private readonly _options: Required<Pick<BlocFuzzySearchOptions<T>,
        'threshold' | 'isCaseSensitive' | 'includeMatches' | 'includeScore' | 'minMatchCharLength' | 'distance'
    >> & Pick<BlocFuzzySearchOptions<T>, 'keys' | 'sortFn'>;

    private readonly _items: readonly T[];

    constructor(items: readonly T[], options?: BlocFuzzySearchOptions<T>) {
        this._items = items;
        this._options = {
            threshold: 0.6,
            isCaseSensitive: false,
            includeMatches: true,
            includeScore: true,
            minMatchCharLength: 1,
            distance: 100,
            ...options,
        };
    }

    search(pattern: string): BlocFuzzyMatch<T>[] {
        if (!pattern) {
            return this._items.map(item => ({ item, score: 0, matches: [] }));
        }

        const results: BlocFuzzyMatch<T>[] = [];
        const keys = this._options.keys ?? ['label'];
        const patternNorm = this._options.isCaseSensitive ? pattern : pattern.toLowerCase();

        for (const item of this._items) {
            const matches: BlocFuzzyMatch<T>['matches'] = [];
            let bestScore = Infinity;

            for (const key of keys) {
                const value = (item as Record<string, unknown>)[key];
                if (value == null) continue;

                const text = String(value);
                const textToSearch = this._options.isCaseSensitive ? text : text.toLowerCase();
                const matchResult = this._fuzzyMatch(textToSearch, patternNorm);

                if (matchResult.isMatch && matchResult.score !== undefined) {
                    if (matchResult.score < bestScore) {
                        bestScore = matchResult.score;
                    }
                    if (this._options.includeMatches && matchResult.indices.length > 0) {
                        matches.push({ key, indices: matchResult.indices, value: text });
                    }
                }
            }

            if (matches.length > 0 && bestScore <= this._options.threshold) {
                results.push({ item, score: bestScore, matches });
            }
        }

        if (this._options.sortFn) {
            results.sort(this._options.sortFn);
        } else {
            results.sort((a, b) => a.score - b.score);
        }

        return results;
    }

    private _fuzzyMatch(
        text: string,
        pattern: string,
    ): { isMatch: boolean; score: number; indices: Array<[number, number]> } {
        const m = pattern.length;
        const n = text.length;

        if (m === 0) return { isMatch: true, score: 0, indices: [] };
        if (m > n) return { isMatch: false, score: 1, indices: [] };

        const matchIndices: number[] = [];
        let patternIndex = 0;
        let prevMatchIndex = -1;
        let consecutiveCount = 0;
        let firstMatchIndex = -1;

        for (let textIndex = 0; textIndex < n && patternIndex < m; textIndex++) {
            if (text[textIndex] === pattern[patternIndex]) {
                matchIndices.push(textIndex);
                if (firstMatchIndex === -1) firstMatchIndex = textIndex;
                if (prevMatchIndex !== -1 && textIndex === prevMatchIndex + 1) consecutiveCount++;
                prevMatchIndex = textIndex;
                patternIndex++;
            }
        }

        if (patternIndex < m) return { isMatch: false, score: 1, indices: [] };

        if (matchIndices.length < this._options.minMatchCharLength) {
            return { isMatch: false, score: 1, indices: [] };
        }

        // Convert individual indices to ranges
        const indices: Array<[number, number]> = [];
        let rangeStart = matchIndices[0];
        let rangeEnd = matchIndices[0];

        for (let i = 1; i < matchIndices.length; i++) {
            if (matchIndices[i] === rangeEnd + 1) {
                rangeEnd = matchIndices[i];
            } else {
                indices.push([rangeStart, rangeEnd]);
                rangeStart = matchIndices[i];
                rangeEnd = matchIndices[i];
            }
        }
        indices.push([rangeStart, rangeEnd]);

        // Score: lower is better (0 = perfect, 1 = worst)
        const span = matchIndices[matchIndices.length - 1] - matchIndices[0] + 1;
        const density = m / span;
        const densityPenalty = 1 - density;
        const positionPenalty = (firstMatchIndex / n) * 0.5;
        const consecutiveRatio = m > 1 ? consecutiveCount / (m - 1) : 0;
        const consecutiveBonus = consecutiveRatio * 0.3;
        const score = densityPenalty * 0.7 + positionPenalty - consecutiveBonus;

        return { isMatch: true, score: Math.max(0, Math.min(1, score)), indices };
    }
}

/**
 * Convenience function for one-shot fuzzy search.
 *
 * @usageNotes
 * ```ts
 * const results = fuzzySearch(items, 'bdg', { keys: ['label'], threshold: 0.6 });
 * const matched = results.map(r => r.item);
 * ```
 */
export function fuzzySearch<T>(
    items: readonly T[],
    pattern: string,
    options?: BlocFuzzySearchOptions<T>,
): BlocFuzzyMatch<T>[] {
    return new BlocFuzzySearch(items, options).search(pattern);
}
