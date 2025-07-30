import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, delay, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  currentUser = signal<User | null>(this.getInitialUser());

  private getInitialUser(): User | null {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  login(email: string, pass: string): Observable<User> {
    if (email.toLowerCase() === 'admin@empresa.com' && pass === '123456') {
      const user: User = {
        id: '1', email: 'admin@empresa.com', firstName: 'Juan', lastName: 'Poueriet',
        permissions: ['sell', 'viewSales', 'manageProducts', 'viewReports', 'manageUsers'],
      };
      return of(user).pipe(
        delay(800),
        tap(u => {
          localStorage.setItem('currentUser', JSON.stringify(u));
          this.currentUser.set(u);
        })
      );
    }
    return throwError(() => new Error('Credenciales inválidas')).pipe(delay(800));
  }

  register(payload: any): Observable<User> {
    console.log('Registrando usuario con:', payload);
    const newUser: User = {
      id: crypto.randomUUID(),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      permissions: ['sell'], // Permisos por defecto para un nuevo usuario
    };
    return of(newUser).pipe(
      delay(800),
      tap(u => {
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.currentUser.set(u);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}