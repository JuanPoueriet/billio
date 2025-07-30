import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        title: 'Iniciar Sesión | FacturaPRO',
        loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'register',
        title: 'Crear Cuenta | FacturaPRO',
        loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];