import {
    AfterContentInit,
    Component,
    contentChildren,
    forwardRef,
    input,
    output,
    signal,
} from '@angular/core';
import { BLOC_TAB_GROUP, BlocTabGroupRef } from './tab.token';
import { BlocTabComponent } from './tab.component';

/**
 * Container component that groups `<bloc-tab>` items and manages
 * which tab is currently active.
 *
 * ```html
 * <bloc-tab-group>
 *   <bloc-tab label="Tab 1">Content 1</bloc-tab>
 *   <bloc-tab label="Tab 2">Content 2</bloc-tab>
 * </bloc-tab-group>
 * ```
 */
@Component({
    selector: 'bloc-tab-group',
    standalone: true,
    template: `
        <div class="bloc-tab-group__header" role="tablist">
            @for (tab of tabs(); track tab.index) {
                <button
                    class="bloc-tab-group__tab"
                    role="tab"
                    type="button"
                    [class.bloc-tab-group__tab--active]="tab.isActive()"
                    [class.bloc-tab-group__tab--disabled]="tab.disabled()"
                    [attr.aria-selected]="tab.isActive()"
                    [attr.aria-disabled]="tab.disabled() || null"
                    [attr.tabindex]="tab.disabled() ? -1 : 0"
                    (click)="_onTabClick(tab)"
                >
                    {{ tab.label() }}
                </button>
            }
        </div>
        <div class="bloc-tab-group__body">
            <ng-content />
        </div>
    `,
    styleUrl: './tab.component.scss',
    providers: [
        {
            provide: BLOC_TAB_GROUP,
            useExisting: forwardRef(() => BlocTabGroupComponent),
        },
    ],
    host: {
        '[class.bloc-tab-group]': 'true',
    },
})
export class BlocTabGroupComponent implements BlocTabGroupRef, AfterContentInit {
    /** Index of the initially active tab. Defaults to `0`. */
    readonly selectedIndex = input<number>(0);

    /** Emits whenever the active tab changes. */
    readonly selectedIndexChange = output<number>();

    readonly activeIndex = signal<number>(0);

    readonly tabs = contentChildren(BlocTabComponent);

    private _nextIndex = 0;

    ngAfterContentInit(): void {
        this.activeIndex.set(this.selectedIndex());
    }

    /** @internal Called by child BlocTabComponent during construction. */
    register(): number {
        return this._nextIndex++;
    }

    /** @internal Select a tab by index. */
    select(index: number): void {
        if (this.activeIndex() === index) return;
        this.activeIndex.set(index);
        this.selectedIndexChange.emit(index);
    }

    _onTabClick(tab: BlocTabComponent): void {
        if (tab.disabled()) return;
        this.select(tab.index);
    }
}
