import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BlocOptionDirective, BlocSelectComponent } from '@bloc-ui/select';

import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-select-demo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        BlocSelectComponent,
        BlocOptionDirective,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './select-demo.component.html',
})
export class SelectDemoComponent {
    readonly fruitControl = new FormControl<string | null>('banana');

    readonly profileForm = new FormGroup({
        fruit: new FormControl<string | null>('apple'),
    });

    readonly loading = signal(false);

    readonly fruits = [
        { value: 'apple', label: 'Apple', note: 'Crisp and classic' },
        { value: 'banana', label: 'Banana', note: 'Soft and sweet' },
        { value: 'orange', label: 'Orange', note: 'Bright citrus' },
        { value: 'grape', label: 'Grape', note: 'Small and juicy' },
        { value: 'mango', label: 'Mango', note: 'Tropical favorite' },
    ];

    readonly snippets = {
        basic: `<bloc-select placeholder="Select fruit">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
        reactive: `<bloc-select [formControl]="fruitControl" placeholder="Pick one">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n  <div bloc-option value="orange">Orange</div>\n</bloc-select>`,
        search: `<bloc-select\n  [formControl]="fruitControl"\n  [searchable]="true"\n  [clearable]="true"\n  placeholder="Search fruit"\n>\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n  <div bloc-option value="orange">Orange</div>\n</bloc-select>`,
        custom: `<bloc-select [formControl]="fruitControl" [searchable]="true" placeholder="Choose fruit">\n  <div bloc-option value="apple">\n    <div class="flex items-center justify-between gap-3 w-full">\n      <span class="font-medium">Apple</span>\n      <span class="text-xs text-slate-500">Crisp and classic</span>\n    </div>\n  </div>\n  <div bloc-option value="banana">\n    <div class="flex items-center justify-between gap-3 w-full">\n      <span class="font-medium">Banana</span>\n      <span class="text-xs text-slate-500">Soft and sweet</span>\n    </div>\n  </div>\n</bloc-select>`,
        disabled: `<bloc-select [disabled]="true" placeholder="Unavailable">\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
        loading: `<bloc-select [loading]="true" [searchable]="true" placeholder="Loading fruits">\n  <div bloc-option value="apple">Apple</div>\n</bloc-select>`,
        formControlName: `<form [formGroup]="profileForm">\n  <bloc-select formControlName="fruit" placeholder="Favorite fruit">\n    <div bloc-option value="apple">Apple</div>\n    <div bloc-option value="banana">Banana</div>\n    <div bloc-option value="orange">Orange</div>\n  </bloc-select>\n</form>`,
        customToken: `<bloc-select\n  style="\n    --bloc-select-border-hover: #10b981;\n    --bloc-select-option-selected: rgba(16, 185, 129, 0.12);\n    --bloc-select-option-hover: rgba(16, 185, 129, 0.06);\n  "\n  [formControl]="fruitControl"\n  placeholder="Green themed"\n>\n  <div bloc-option value="apple">Apple</div>\n  <div bloc-option value="banana">Banana</div>\n</bloc-select>`,
    };

    toggleLoading(): void {
        const next = !this.loading();
        this.loading.set(next);

        if (next) {
            setTimeout(() => this.loading.set(false), 2200);
        }
    }
}
