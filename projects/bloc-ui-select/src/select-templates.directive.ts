import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: 'ng-template[blocSelectLoading]',
    standalone: true,
})
export class BlocSelectLoadingDirective {
    constructor(public readonly templateRef: TemplateRef<void>) {}
}

@Directive({
    selector: 'ng-template[blocSelectEmpty]',
    standalone: true,
})
export class BlocSelectEmptyDirective {
    constructor(public readonly templateRef: TemplateRef<{ $implicit: string }>) {}
}

@Directive({
    selector: 'ng-template[blocSelectIcon]',
    standalone: true,
})
export class BlocSelectIconDirective {
    constructor(public readonly templateRef: TemplateRef<{ $implicit: boolean }>) {}
}
