// src/app/features/auth/login/login.page.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth';
import { LucideAngularModule, Mail, Lock } from 'lucide-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
  ],
})
export class LoginPage implements OnInit {
  MailIcon = Mail;
  LockIcon = Lock;

  // --- Inyección de Dependencias ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Estado del Formulario y UI ---
  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoggingIn = signal(false);

  ngOnInit() {
    // Corrección: Solo una inicialización del formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Getters para acceder a los campos
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  // --- Lógica de Envío del Formulario ---
  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoggingIn.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        // Manejo de errores específicos
        if (err.status === 401) {
          this.errorMessage.set('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
        } else if (err.status === 400) {
          this.errorMessage.set('Formato de solicitud incorrecto. Por favor, intenta nuevamente.');
        } else {
          this.errorMessage.set('Ocurrió un error inesperado. Por favor, intenta más tarde.');
        }
        this.isLoggingIn.set(false);
      }
    });
  }
}