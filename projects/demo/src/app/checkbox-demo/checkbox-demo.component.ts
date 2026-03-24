import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlocButtonComponent, BlocCheckboxComponent } from 'bloc-ui';

@Component({
    selector: 'app-checkbox-demo',
    standalone: true,
    imports: [BlocCheckboxComponent, BlocButtonComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
    // Template-driven (ngModel)
    ngModelValue = false;

    // Reactive — enabled
    readonly reactiveCtrl = new FormControl(false);

    // Reactive — initially checked and disabled
    readonly disabledCtrl = new FormControl(true);

    constructor() {
        this.disabledCtrl.disable();
    }

    toggleDisabled(): void {
        this.disabledCtrl.disabled
            ? this.disabledCtrl.enable()
            : this.disabledCtrl.disable();
    }
}
