import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha-19';
import { environment } from '../../../../../environments/environment';
import { LucideAngularModule, Mail, AlertCircle, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  
  providers: [
    ReCaptchaV3Service,
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey }
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    RouterModule,
    LucideAngularModule
  ]
})
export class ForgotPasswordPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private recaptchaV3Service = inject(ReCaptchaV3Service);

  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Iconos
  MailIcon = Mail;
  AlertCircleIcon = AlertCircle;
  CheckCircleIcon = CheckCircle;

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.recaptchaV3Service.execute('forgotPassword').subscribe({
  next: (recaptchaToken) => {
    const email = this.forgotPasswordForm.value.email;
    // Pasa el recaptchaToken obtenido al servicio
    this.authService.forgotPassword(email, recaptchaToken).subscribe({
      next: () => {
            this.isLoading = false;
            this.successMessage = 'Se han enviado instrucciones a tu correo electrónico';
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.customMessage || 'Error al enviar las instrucciones. Por favor, intenta de nuevo.';
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al verificar reCAPTCHA. Por favor, intenta de nuevo.';
      }
    });
  }
}