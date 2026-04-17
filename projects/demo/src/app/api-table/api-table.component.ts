import { Component, computed, input, ViewEncapsulation } from '@angular/core';

export interface ApiColumnDef {
    header: string;
    cellType: 'name' | 'type' | 'default' | 'description';
}

export const INPUTS_COLUMNS: ApiColumnDef[] = [
    { header: 'Input', cellType: 'name' },
    { header: 'Type', cellType: 'type' },
    { header: 'Default', cellType: 'default' },
    { header: 'Description', cellType: 'description' },
];

export const OUTPUTS_COLUMNS: ApiColumnDef[] = [
    { header: 'Output', cellType: 'name' },
    { header: 'Type', cellType: 'type' },
    { header: 'Description', cellType: 'description' },
];

export const TOKENS_COLUMNS: ApiColumnDef[] = [
    { header: 'Token', cellType: 'name' },
    { header: 'Default', cellType: 'default' },
    { header: 'Description', cellType: 'description' },
];

@Component({
    selector: 'app-api-table',
    standalone: true,
    imports: [],
    templateUrl: './api-table.component.html',
    styleUrl: './api-table.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class ApiTableComponent {
    title = input.required<string>();
    selector = input<string>('');
    columns = input.required<ApiColumnDef[]>();
    rows = input.required<string[][]>();
    note = input<string>('');

    protected badgeVariant = computed(() => {
        const t = this.title().toLowerCase();
        if (t.includes('output')) return 'outputs';
        if (t.includes('token') || t.includes('css')) return 'tokens';
        return 'inputs';
    });
}
