// src/app/core/services/auth.service.ts

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { RegisterPayload } from '../../shared/interfaces/register-payload.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  organizationId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';

  // --- Estado reactivo con Signals ---
  private _currentUser = signal<User | null>(null);
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.checkAuthStatus();
  }

  // --- Método de registro ---
  register(payload: RegisterPayload): Observable<User> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<User>(url, payload).pipe(
      tap(() => console.log('Registro exitoso. Por favor, inicia sesión.')),
      catchError(this.handleError('register'))
    );
  }

  // --- Método de login adaptado a cookies ---
  login(credentials: LoginCredentials): Observable<User> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<User>(
      url,
      credentials,
      { withCredentials: true } // Habilitar cookies
    ).pipe(
      tap(user => this._currentUser.set(user)),
      catchError(this.handleError('login'))
    );
  }

  // --- Método de logout adaptado a cookies ---
  logout(): void {
    const url = `${this.apiUrl}/logout`;
    this.http.post(url, {}, { withCredentials: true }).subscribe({
      next: () => {
        this._currentUser.set(null);
        console.log('Sesión cerrada.');
        this.router.navigateByUrl('/auth/login');
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
        // Limpiar estado incluso si hay error
        this._currentUser.set(null);
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

  // --- Verificar estado de autenticación con endpoint de estado ---
  // public checkAuthStatus(): void {
  //   const url = `${this.apiUrl}/status`;
  //   this.http.get<{ user: User }>(url, { withCredentials: true }).subscribe({
  //     next: (res) => this._currentUser.set(res.user),
  //     error: () => this._currentUser.set(null)
  //   });
  // }

    public checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/status`;
    return this.http.get<{ user: User }>(url, { withCredentials: true }).pipe(
      tap(res => this._currentUser.set(res.user)), // Actualiza el usuario si tiene éxito
      map(res => !!res.user), // Emite 'true' si la respuesta tiene un usuario
      catchError(() => {
        this._currentUser.set(null); // Limpia el usuario en caso de error
        return throwError(() => false); // Emite un error con 'false'
      })
    );
  }

  // --- Manejo de errores mejorado ---
  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = error.error?.message || error.message;

        if (error.status === 401) {
          errorMessage = 'Credenciales inválidas. Por favor verifica tus datos.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permiso para realizar esta acción.';
        } else if (error.status === 409) {
          errorMessage = 'El usuario ya existe. Por favor utiliza otro correo.';
        } else if (error.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor intenta más tarde.';
        }
      }

      console.error(`La operación '${operation}' falló:`, errorMessage);
      return throwError(() => ({
        ...error,
        customMessage: errorMessage,
        status: error.status
      }));
    };
  }
}