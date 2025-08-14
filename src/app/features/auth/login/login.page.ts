// src/app/features/auth/login/login.page.ts

import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { LucideAngularModule, Mail, Lock, EyeOff, Eye, AlertCircle } from 'lucide-angular';
// import { RecaptchaV3Service } from 'ng-recaptcha';
// import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaV3Module } from 'ng-recaptcha-2';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaSettings, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha-19';
import { ThemeService } from '../../../core/services/theme';

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
    RecaptchaV3Module
  ],
  providers: [
    ReCaptchaV3Service,
  ],
})
export class LoginPage implements OnInit {
  MailIcon = Mail;
  LockIcon = Lock;
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;

  AlertCircleIcon = AlertCircle; // Nuevo icono para errores
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private recaptchaV3Service = inject(ReCaptchaV3Service);

  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoggingIn = signal(false);
  passwordVisible = signal(false);

  @ViewChild('formElement') formElement!: ElementRef<HTMLFormElement>;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [true] // Añade el nuevo control
    });
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoggingIn.set(true);
    this.errorMessage.set(null);

    this.recaptchaV3Service.execute('login').subscribe({
      next: (token) => {
        const formValue = this.loginForm.getRawValue();

        const credentials: any = {
          email: formValue.email,
          password: formValue.password,
          rememberMe: formValue.rememberMe,
          recaptchaToken: token,
        };

        this.authService.login(credentials).subscribe({
          next: () => {
            this.router.navigate(['/app/dashboard']);
            this.isLoggingIn.set(false);
          },
          error: (err) => {
            console.error('Error en el inicio de sesión:', err);
            this.errorMessage.set(err.message || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            this.isLoggingIn.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error al ejecutar reCAPTCHA:', err);
        this.errorMessage.set('No se pudo verificar que no eres un robot. Por favor, recarga la página.');
        this.isLoggingIn.set(false);
      },
    });
  }




  private getFirstInvalidControl(): HTMLElement | null {
    const invalidControls = this.formElement.nativeElement.querySelectorAll(
      '.is-invalid, [aria-invalid="true"]'
    );

    return invalidControls.length > 0
      ? invalidControls[0] as HTMLElement
      : null;
  }
}