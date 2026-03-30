import { Component, signal } from '@angular/core';
import {
    ReactiveFormsModule,
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
} from '@angular/forms';
import { BlocTextareaDirective, BlocInputErrorDirective } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-textarea-demo',
    standalone: true,
    imports: [
        BlocTextareaDirective,
        BlocInputErrorDirective,
        FormsModule,
        ReactiveFormsModule,
        SampleCodeComponent,
        InstallCommandComponent,
    ],
    templateUrl: './textarea-demo.component.html',
})
export class TextareaDemoComponent {
    readonly bio = signal('');

    ngModelValue = '';

    readonly descriptionCtrl = new FormControl('', [Validators.required, Validators.minLength(20)]);

    readonly feedbackFormGroup = new FormGroup({
        notes: new FormControl('', [Validators.required, Validators.maxLength(180)]),
    });

    readonly snippets = {
        basic: `<textarea blocTextarea\n  rows="4"\n  placeholder="Tell us about your project"></textarea>`,
        disabled: `<textarea blocTextarea\n  rows="4"\n  placeholder="Cannot edit"\n  disabled></textarea>`,
        customToken: `<textarea blocTextarea\n  rows="5"\n  placeholder="Resizable notes"\n  style="--bloc-textarea-min-height: 140px; --bloc-textarea-radius: 16px"></textarea>`,
        manualError: `<textarea blocTextarea [error]="true"\n  placeholder="Project summary"></textarea>\n<bloc-input-error>\n  A summary is required.\n</bloc-input-error>`,
        formControl: `<textarea blocTextarea\n  rows="4"\n  [formControl]="descriptionCtrl"\n  placeholder="Write at least 20 characters"></textarea>\n@if (descriptionCtrl.invalid && descriptionCtrl.touched) {\n  <bloc-input-error>\n    Please add at least 20 characters.\n  </bloc-input-error>\n}`,
        ngModel: `<textarea blocTextarea\n  rows="4"\n  [(ngModel)]="draft"\n  placeholder="Start typing"></textarea>\n<p>Characters: {{ draft.length }}</p>`,
        formControlName: `<form [formGroup]="feedbackFormGroup">\n  <textarea blocTextarea\n    rows="5"\n    formControlName="notes"\n    placeholder="Share your feedback"></textarea>\n  @if (feedbackFormGroup.get('notes')?.invalid &&\n       feedbackFormGroup.get('notes')?.touched) {\n    <bloc-input-error>Feedback is required.</bloc-input-error>\n  }\n</form>`,
    };
}
