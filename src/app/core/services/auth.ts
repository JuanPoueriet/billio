// src/app/core/services/auth.service.ts

import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { RegisterPayload } from '../../shared/interfaces/register-payload.interface';

// =============================================================================
// INTERFACES
// =============================================================================

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

export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'access_token';

  // --- Estado reactivo con Signals ---
  private _currentUser = signal<User | null>(null);
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.checkAuthStatus();
  }

  // --- Método para obtener token ---
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- Método centralizado para decodificar payload del token ---
  private getTokenPayload(token: string): any | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // --- Método para verificar expiración del token ---
  isTokenExpired(token: string): boolean {
    const payload = this.getTokenPayload(token);
    if (!payload) return true;

    const expiry = payload.exp;
    return (Math.floor(Date.now() / 1000)) >= expiry;
  }

  // --- Método de registro ---
  register(payload: RegisterPayload): Observable<User> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<User>(url, payload).pipe(
      tap(() => console.log('Registro exitoso. Por favor, inicia sesión.')),
      catchError(this.handleError('register'))
    );
  }

  // --- Método de login ---
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, credentials).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.setAuthentication(response.accessToken);
        }
      }),
      catchError(this.handleError('login'))
    );
  }

  // --- Método de logout ---
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._currentUser.set(null);
    console.log('Sesión cerrada.');
    this.router.navigateByUrl('/auth/login');
  }

  // --- Verificar estado de autenticación ---
  public checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        console.log('Token expirado. Cerrando sesión...');
        this.logout();
      } else {
        this.setAuthentication(token);
      }
    }
  }

  // --- Establecer autenticación ---
  private setAuthentication(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const user = this.decodeToken(token);
    this._currentUser.set(user);
  }

  // --- Decodificar token usando el método centralizado ---
  private decodeToken(token: string): User | null {
    const payload = this.getTokenPayload(token);
    if (!payload) return null;

    return {
      id: payload.id,
      email: payload.email,
      organizationId: payload.organizationId,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      isActive: payload.isActive !== undefined ? payload.isActive : true,
    };
  }

  // --- Manejo de errores mejorado ---
  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorMessage = error.error?.message || error.message;

        // Manejo específico de errores HTTP
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