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
    path: 'forgot-password', 
    loadComponent: () => import('./forgot-password/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./reset-password/reset-password.page/reset-password.page').then(m => m.ResetPasswordPage)
  },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];