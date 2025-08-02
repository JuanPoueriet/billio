// src/app/features/auth/login/login.page.ts

import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
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
import { LucideAngularModule, Mail, Lock, EyeOff, Eye } from 'lucide-angular';

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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoggingIn = signal(false);

  // ... existing icon declarations ...
  EyeIcon = Eye;
  EyeOffIcon = EyeOff;

  // Add password visibility signal
  passwordVisible = signal(false);

  // Add reference to form for focus management
  @ViewChild('formElement') formElement!: ElementRef<HTMLFormElement>;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  // Add password toggle method
  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  onSubmit(): void {

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      // Focus first invalid field
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
      return;
    }

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
        // Usar mensaje personalizado del servicio
        this.errorMessage.set(err.customMessage || 'Ocurrió un error inesperado. Por favor, intenta más tarde.');
        this.isLoggingIn.set(false);
      }
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

