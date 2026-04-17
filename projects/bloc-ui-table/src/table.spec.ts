import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { BlocTableComponent } from './table.component';
import { BlocColumnComponent, BlocCellDefDirective } from './column.component';
import { BlocTableModule } from './table.module';

// ── Test helpers ───────────────────────────────────────────────────────────

const SAMPLE_DATA = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'User' },
    { name: 'Carol', email: 'carol@example.com', role: 'Editor' },
];

// ── Default test host ──────────────────────────────────────────────────────

@Component({
    standalone: true,
    imports: [BlocTableComponent, BlocColumnComponent, BlocCellDefDirective],
    template: `
        <bloc-table
            [data]="data()"
            [striped]="striped()"
            [bordered]="bordered()"
            [hoverable]="hoverable()"
            [size]="size()"
        >
            <bloc-column field="name" header="Name" />
            <bloc-column field="email" header="Email" />
            <bloc-column field="role" header="Role" />
        </bloc-table>
    `,
})
class DefaultTableHost {
    readonly data = signal<Record<string, unknown>[]>(SAMPLE_DATA);
    readonly striped = signal(false);
    readonly bordered = signal(false);
    readonly hoverable = signal(false);
    readonly size = signal<'sm' | 'md' | 'lg'>('md');
}

// ── Custom cell template test host ─────────────────────────────────────────

@Component({
    standalone: true,
    imports: [BlocTableComponent, BlocColumnComponent, BlocCellDefDirective],
    template: `
        <bloc-table [data]="data">
            <bloc-column field="name" header="Name" />
            <bloc-column field="status" header="Status">
                <ng-template blocCellDef let-value>
                    <span class="status-cell">{{ value ? 'Active' : 'Inactive' }}</span>
                </ng-template>
            </bloc-column>
        </bloc-table>
    `,
})
class CustomCellTableHost {
    data: Record<string, unknown>[] = [
        { name: 'Alice', status: true },
        { name: 'Bob', status: false },
    ];
}

// ── BlocTableComponent ─────────────────────────────────────────────────────

describe('BlocTableComponent', () => {
    let fixture: ComponentFixture<DefaultTableHost>;
    let host: DefaultTableHost;

    function el(): HTMLElement {
        return fixture.nativeElement as HTMLElement;
    }

    function tableHost(): HTMLElement {
        return el().querySelector('bloc-table')!;
    }

    function headerCells(): NodeListOf<HTMLTableCellElement> {
        return el().querySelectorAll('th');
    }

    function dataRows(): NodeListOf<HTMLTableRowElement> {
        return el().querySelectorAll('tbody tr');
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DefaultTableHost],
        }).compileComponents();

        fixture = TestBed.createComponent(DefaultTableHost);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ── Creation ──────────────────────────────────────────────────────────

    it('should create', () => {
        expect(tableHost()).toBeTruthy();
    });

    it('should apply bloc-table class on host', () => {
        expect(tableHost().classList.contains('bloc-table')).toBe(true);
    });

    // ── Column headers ────────────────────────────────────────────────────

    it('renders the correct number of header cells', () => {
        expect(headerCells().length).toBe(3);
    });

    it('renders column headers from the header input', () => {
        const texts = Array.from(headerCells()).map((th) => th.textContent?.trim());
        expect(texts).toEqual(['Name', 'Email', 'Role']);
    });

    // ── Data rows ─────────────────────────────────────────────────────────

    it('renders one row per data item', () => {
        expect(dataRows().length).toBe(SAMPLE_DATA.length);
    });

    it('renders cell values from the data array', () => {
        const firstRow = dataRows()[0];
        const cells = firstRow.querySelectorAll('td');
        expect(cells[0].textContent?.trim()).toBe('Alice');
        expect(cells[1].textContent?.trim()).toBe('alice@example.com');
        expect(cells[2].textContent?.trim()).toBe('Admin');
    });

    it('empty data renders no tbody rows', () => {
        host.data.set([]);
        fixture.detectChanges();
        expect(dataRows().length).toBe(0);
    });

    // ── Modifier classes ──────────────────────────────────────────────────

    it('striped: true adds bloc-table--striped class', () => {
        host.striped.set(true);
        fixture.detectChanges();
        expect(tableHost().classList.contains('bloc-table--striped')).toBe(true);
    });

    it('striped: false removes bloc-table--striped class', () => {
        expect(tableHost().classList.contains('bloc-table--striped')).toBe(false);
    });

    it('bordered: true adds bloc-table--bordered class', () => {
        host.bordered.set(true);
        fixture.detectChanges();
        expect(tableHost().classList.contains('bloc-table--bordered')).toBe(true);
    });

    it('hoverable: true adds bloc-table--hoverable class', () => {
        host.hoverable.set(true);
        fixture.detectChanges();
        expect(tableHost().classList.contains('bloc-table--hoverable')).toBe(true);
    });

    // ── Size ──────────────────────────────────────────────────────────────

    it('size "sm" adds bloc-table--sm class', () => {
        host.size.set('sm');
        fixture.detectChanges();
        expect(tableHost().classList.contains('bloc-table--sm')).toBe(true);
    });

    it('size "lg" adds bloc-table--lg class', () => {
        host.size.set('lg');
        fixture.detectChanges();
        expect(tableHost().classList.contains('bloc-table--lg')).toBe(true);
    });

    it('default size "md" does not add sm or lg class', () => {
        expect(tableHost().classList.contains('bloc-table--sm')).toBe(false);
        expect(tableHost().classList.contains('bloc-table--lg')).toBe(false);
    });
});

// ── Custom blocCellDef template ────────────────────────────────────────────

describe('BlocTableComponent — custom cell template', () => {
    it('renders custom cell template content', async () => {
        await TestBed.configureTestingModule({
            imports: [CustomCellTableHost],
        }).compileComponents();

        const fixture = TestBed.createComponent(CustomCellTableHost);
        fixture.detectChanges();

        const statusCells = fixture.nativeElement.querySelectorAll('.status-cell');
        expect(statusCells.length).toBe(2);
        expect(statusCells[0].textContent.trim()).toBe('Active');
        expect(statusCells[1].textContent.trim()).toBe('Inactive');
    });
});

// ── BlocTableModule ────────────────────────────────────────────────────────

describe('BlocTableModule', () => {
    it('should be importable as an NgModule', async () => {
        await TestBed.configureTestingModule({
            imports: [BlocTableModule],
        }).compileComponents();
        expect(true).toBe(true);
    });
});
