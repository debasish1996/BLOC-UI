import { Component, inject } from '@angular/core';
import { BLOC_MODAL_DATA, BlocModal } from '@bloc-ui/modal';

export interface UserModalData {
    name: string;
    role: string;
}

@Component({
    selector: 'app-data-modal',
    standalone: true,
    template: `
        <p class="m-0 mb-3 text-sm text-slate-600">
            Data injected via <code>BLOC_MODAL_DATA</code>:
        </p>
        <ul class="m-0 pl-4 text-sm text-slate-800 flex flex-col gap-1">
            <li><strong>Name:</strong> {{ data.name }}</li>
            <li><strong>Role:</strong> {{ data.role }}</li>
        </ul>
    `,
})
export class DataModalComponent extends BlocModal<UserModalData, boolean> {}
