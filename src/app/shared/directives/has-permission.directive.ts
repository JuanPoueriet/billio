import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef, inject, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective implements OnDestroy {
    private authService = inject(AuthService);
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);

    private requiredPermissions: string[] = [];
    private authSubscription: Subscription;

    constructor() {
        // Reacciona a los cambios en el estado de autenticación
        this.authSubscription = this.authService.isAuthenticated$.subscribe(() => {
            this.updateView();
        });
    }

    @Input()
    set hasPermission(value: string | string[] | undefined | null) {
        this.requiredPermissions = Array.isArray(value) ? value : (value ? [value] : []);
        this.updateView();
    }

    private updateView(): void {
        if (this.authService.hasPermissions(this.requiredPermissions)) {
            if (!this.viewContainer.length) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        } else {
            this.viewContainer.clear();
        }
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}