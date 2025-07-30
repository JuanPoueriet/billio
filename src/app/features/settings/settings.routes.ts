import { Routes } from '@angular/router';
import { SettingsLayout } from './layout/settings.layout';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsLayout,
        children: [
            {
                path: 'profile',
                title: 'Perfil de la Empresa',
                loadComponent: () => import('./company-profile/company-profile.page').then(m => m.CompanyProfilePage)
            },
            {
                path: 'users',
                title: 'Gestión de Usuarios',
                loadComponent: () => import('./user-management/user-management.page').then(m => m.UserManagementPage)
            },
            {
                path: 'branding',
                title: 'Personalización',
                loadComponent: () => import('./branding/branding.page').then(m => m.BrandingPage)
            },
            {
                path: 'billing',
                title: 'Facturación y Plan',
                loadComponent: () => import('./billing/billing.page').then(m => m.BillingPage)
            },
            { path: '', redirectTo: 'profile', pathMatch: 'full' }
        ]
    }
];