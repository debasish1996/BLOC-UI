import { Component, inject } from '@angular/core';
import { BlocToastService } from '@bloc-ui/toast';
import { BlocButtonComponent } from 'bloc-ui-core';
import { InstallCommandComponent } from '../install-command/install-command.component';
import { SampleCodeComponent } from '../sample-code/sample-code.component';

@Component({
    selector: 'app-toast-demo',
    standalone: true,
    imports: [BlocButtonComponent, SampleCodeComponent, InstallCommandComponent],
    templateUrl: './toast-demo.component.html',
})
export class ToastDemoComponent {
    private readonly toast = inject(BlocToastService);

    showInfo(): void {
        this.toast.info('This is an informational message.');
    }

    showSuccess(): void {
        this.toast.success('Operation completed successfully!', 'Success');
    }

    showWarning(): void {
        this.toast.warning('Please review your input before continuing.', 'Warning');
    }

    showError(): void {
        this.toast.error('Something went wrong. Please try again.', 'Error');
    }

    showPersistent(): void {
        this.toast.show({ message: 'This toast will not auto-dismiss.', type: 'info', title: 'Persistent', duration: 0 });
    }

    showNonDismissible(): void {
        this.toast.show({ message: 'Cannot be closed manually.', type: 'warning', dismissible: false, duration: 5000 });
    }

    dismissAll(): void {
        this.toast.dismissAll();
    }

    readonly snippets = {
        info: `toastService.info('Informational message.');`,
        success: `toastService.success('Operation completed!', 'Success');`,
        warning: `toastService.warning('Review your input.', 'Warning');`,
        error: `toastService.error('Something went wrong.', 'Error');`,
        persistent: `toastService.show({\n  message: 'This toast will not auto-dismiss.',\n  type: 'info',\n  title: 'Persistent',\n  duration: 0,\n});`,
        nonDismissible: `toastService.show({\n  message: 'Cannot be closed manually.',\n  type: 'warning',\n  dismissible: false,\n  duration: 5000,\n});`,
        inject: `private readonly toast = inject(BlocToastService);`,
    };
}
