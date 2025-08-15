import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError, of, BehaviorSubject } from 'rxjs';

import { RegisterPayload } from '../../shared/interfaces/register-payload.interface';
import { User } from '../../shared/interfaces/user.interface';
import { LoginCredentials } from '../../shared/interfaces/login-credentials.interface';
import { AuthStatus } from '../../shared/enums/auth-status.enum';

interface LoginResponse {
  user: User;
  access_token: string;
}




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL base de tu API de autenticación. Ajústala si es necesario.
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';

  // --- Estado Reactivo con Signals ---

  // Almacena la información del usuario actual. Privado para controlar su modificación.
  private _currentUser = signal<User | null>(null);
  // Almacena el estado actual de la autenticación.
  private _authStatus = signal<AuthStatus>(AuthStatus.pending);

  // --- Selectores Públicos (Computed Signals) ---

  // Expone el usuario actual de forma pública y de solo lectura.
  public readonly currentUser = computed(() => this._currentUser());
  // Expone el estado de autenticación actual de forma pública y de solo lectura.
  public readonly authStatus = computed(() => this._authStatus());
  // Un selector booleano para verificar fácilmente si el usuario está autenticado.
  public readonly isAuthenticated = computed(() => this._authStatus() === AuthStatus.authenticated);

  /**
   * El constructor se ejecuta cuando se instancia el servicio.
   * Llama a checkAuthStatus para verificar si ya existe una sesión válida en el backend.
   */



  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticated.asObservable();

  private _user = new BehaviorSubject<User | null>(null);
  public user$ = this._user.asObservable();




  constructor() {
    // this.checkAuthStatus().subscribe();
  }







  /**
   * Refresca el token de acceso utilizando el token de refresco (almacenado en una cookie segura).
   * @returns Un observable que, al completarse, actualiza el estado de autenticación.
   */
  refreshAccessToken(): Observable<LoginResponse> {
    // --- CORRECCIÓN ---
    // Cambiado de post a get y eliminado el cuerpo vacío `{}`
    return this.http.get<LoginResponse>(`${this.apiUrl}/refresh`, 
      { withCredentials: true }
    ).pipe(
    ).pipe(
      tap((response) => {
        if (response && response.user && response.access_token) {
          this._isAuthenticated.next(true);
          this._user.next(response.user);
          console.log('[AuthService] Token refrescado exitosamente');
        }
      })
    );
    // --- FIN DE LA CORRECCIÓN ---
  }

  /**
   * Envía las credenciales del usuario al backend para iniciar sesión.
   * @param credentials Objeto con email, password y recaptchaToken.
   * @returns Un observable que emite el objeto User en caso de éxito.
   */
  login(credentials: LoginCredentials): Observable<User> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ user: User }>(url, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this._currentUser.set(response.user);
        this._authStatus.set(AuthStatus.authenticated);
      }),
      map(response => response.user),
      catchError(err => this.handleError('login', err))
    );
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param payload Objeto con los datos del nuevo usuario.
   * @returns Un observable que emite el objeto User del usuario recién creado.
   */
  register(payload: RegisterPayload): Observable<User> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<{ user: User }>(url, payload, { withCredentials: true }).pipe(
      map(response => response.user),
      tap(user => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        this.router.navigate(['/app/dashboard']);
      }),
      catchError(err => this.handleError('register', err))
    );
  }

  /**
   * Cierra la sesión del usuario tanto en el frontend como en el backend.
   */
  logout(): void {
    const url = `${this.apiUrl}/logout`;
    this.http.post(url, {}, { withCredentials: true }).subscribe({
      // Se ejecuta siempre, sin importar si el backend responde con éxito o error,
      // para asegurar que el usuario es deslogueado del lado del cliente.
      complete: () => {
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.unauthenticated);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  /**
   * Verifica el estado de la sesión contra el backend (usualmente con una cookie).
   * @returns Un observable que emite `true` si la sesión es válida, `false` si no lo es.
   */
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/status`;
    this._authStatus.set(AuthStatus.pending);
    return this.http.get<{ user: User }>(url, { withCredentials: true }).pipe(
      map(res => {
        this._currentUser.set(res.user);
        this._authStatus.set(AuthStatus.authenticated);
        return true;
      }),
      catchError(() => {
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.unauthenticated);
        return of(false); // Devuelve un observable de `false` para no romper la cadena.
      })
    );
  }

  /**
   * Inicia el flujo de recuperación de contraseña.
   * @param email El correo electrónico del usuario.
   * @returns Un observable que emite un mensaje de confirmación del backend.
   */
  forgotPassword(email: string, recaptchaToken: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/forgot-password`;
    // Añade el recaptchaToken al cuerpo de la solicitud
    return this.http.post<{ message: string }>(url, { email, recaptchaToken }).pipe(
      catchError(err => this.handleError('forgotPassword', err))
    );
  }

  /**
   * Envía la nueva contraseña y el token de reseteo al backend.
   * @param token El token recibido por el usuario (generalmente en la URL).
   * @param password La nueva contraseña.
   * @returns Un observable que emite el objeto User con la información actualizada.
   */
  resetPassword(token: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http.post<User>(url, { token, password }).pipe(
      catchError(err => this.handleError('resetPassword', err))
    );
  }

  /**
   * Manejador de errores centralizado para las llamadas HTTP.
   * @param operation El nombre de la operación que falló (ej. 'login').
   * @param error El objeto HttpErrorResponse.
   * @returns Un observable que emite un error estructurado para el componente.
   */
  private handleError(operation: string, error: HttpErrorResponse): Observable<never> {
    let customErrorMessage = 'Ocurrió un error inesperado. Por favor, intenta más tarde.';
    console.error(`Error en la operación '${operation}'. Código: ${error.status}`, error.error);

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red.
      customErrorMessage = `Error de red: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error.
      const serverError = error.error;
      if (serverError && typeof serverError.message === 'string') {
        customErrorMessage = serverError.message;
      } else if (serverError && Array.isArray(serverError.message)) {
        // Maneja los errores de validación de class-validator de NestJS.
        customErrorMessage = serverError.message.join('. ');
      } else if (error.status === 401) {
        customErrorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else if (error.status === 403) {
        customErrorMessage = 'No tienes permiso o la verificación reCAPTCHA ha fallado.';
      } else if (error.status === 404) {
        customErrorMessage = 'El recurso solicitado no fue encontrado.';
      }
    }

    // Devuelve un error observable con un objeto estructurado.
    // Esto previene excepciones no capturadas y permite al componente mostrar un mensaje claro.
    return throwError(() => ({
      status: error.status,
      message: customErrorMessage
    }));
  }
}