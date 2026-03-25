import { Component, computed, inject, input } from '@angular/core';
import { BLOC_TAB_GROUP } from './tab.token';

/**
 * Individual tab panel. Must be placed inside a `<bloc-tab-group>`.
 *
 * ```html
 * <bloc-tab label="Profile">Profile content here</bloc-tab>
 * ```
 */
@Component({
    selector: 'bloc-tab',
    standalone: true,
    template: `
    @if (isActive()) {
      <div class="bloc-tab__panel" role="tabpanel">
        <ng-content />
      </div>
    }
  `,
    host: {
        '[class.bloc-tab]': 'true',
        '[class.bloc-tab--active]': 'isActive()',
    },
})
export class BlocTabComponent {
    /** Label displayed in the tab header. */
    readonly label = input.required<string>();

    /** Whether this tab is disabled. */
    readonly disabled = input<boolean>(false);

    private readonly _group = inject(BLOC_TAB_GROUP);
    private readonly _index = this._group.register();

    readonly isActive = computed(() => this._group.activeIndex() === this._index);

    /** @internal Index of this tab within the group. */
    get index(): number {
        return this._index;
    }
}
