import { Component, OnInit, inject } from '@angular/core';
import { 
  FormBuilder, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl, 
  ValidationErrors, 
  FormGroup 
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth';
import { strongPasswordValidator } from '../../../shared/validators/password.validator';

/**
 * Validador de coincidencia de contraseñas
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-password.page.html',
})
export class SetPasswordPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private token: string | null = null;

  /**
   * Formulario de restablecimiento de contraseña
   */
  readonly setPasswordForm: FormGroup = this.fb.group(
    {
      password: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator()],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  onSubmit(): void {
    if (this.setPasswordForm.invalid || !this.token) {
      return;
    }

    const password = this.setPasswordForm.get('password')?.value;

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { passwordSet: 'true' },
        });
      },
      error: (err: unknown) => {
        console.error('Error al restablecer contraseña:', err);
        // TODO: Mostrar mensaje de error en la UI
      },
    });
  }
}
