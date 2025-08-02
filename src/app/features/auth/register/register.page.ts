// src/app/features/auth/register/register.page.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// --- Dependencias de Lógica y UI ---
import { ArrowLeft, ArrowRight, BarChart2, Check, CheckCircle, LucideAngularModule, Package, Rocket } from 'lucide-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../../../core/services/auth';
import { RegisterPayload } from '../../../shared/interfaces/register-payload.interface';
import { StepAccount } from './steps/step-account/step-account';
import { StepAccess } from './steps/step-access/step-access';
import { StepBusiness } from './steps/step-business/step-business';
import { StepConfiguration } from './steps/step-configuration/step-configuration';
import { StepPlan } from './steps/step-plan/step-plan';
import { strongPasswordValidator } from '../../../shared/validators/password.validator'; // Nueva importación

// --- Función Validadora ---
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    RouterLink,
    StepAccount,
    StepAccess,
    StepBusiness,
    StepConfiguration,
    StepPlan,
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterPage implements OnInit {

  // Íconos para la plantilla
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly BarChart2Icon = BarChart2;
  protected readonly PackageIcon = Package;
  protected readonly CheckIcon = Check;
  protected readonly ArrowLeftIcon = ArrowLeft;
  protected readonly ArrowRightIcon = ArrowRight;
  protected readonly RocketIcon = Rocket;

  // --- Inyección de Dependencias ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Lógica del Asistente de Pasos (Stepper) ---
  currentStep = signal(1);

  // --- Estado del Formulario y UI (usando signals como lo espera el HTML) ---
  registerForm!: FormGroup;
  errorMessage = signal<string | null>(null);
  isRegistering = signal(false);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      account: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        jobTitle: [''],
        phone: [''],
        avatarUrl: [null],
      }),
      access: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        passwordGroup: this.fb.group({
          password: ['', [
            Validators.required,
            Validators.minLength(8),
            strongPasswordValidator() // Nueva validación
          ]],
          confirmPassword: ['', [Validators.required]],
        }, { validators: passwordMatchValidator }),
      }),
      business: this.fb.group({
        companyName: ['', [Validators.required]],
        industry: ['', [Validators.required]],
        legalForm: [''],
        numberOfEmployees: [''],
        website: [''],
        logoFile: [null],
      }),
      configuration: this.fb.group({
        address: [''], city: [''], stateOrProvince: [''], postalCode: [''],
        country: ['DO', [Validators.required]],
        companyPhone: ['', [Validators.required]],
        taxId: ['', [Validators.required]],
        naicsCode: [''],
        currency: ['DOP', [Validators.required]],
        defaultTaxRate: [0],
        fiscalYearStart: ['01-01'],
        timezone: ['America/Santo_Domingo', [Validators.required]],
      }),
      plan: this.fb.group({
        planId: ['trial', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
        marketingOptIn: [true],
      }),
    });
  }

  // Array de booleanos para rastrear qué pasos están completados
  stepsCompleted = signal<boolean[]>(new Array(5).fill(false));

  nextStep(): void {
    const currentForm = this.getCurrentStepForm();
    if (currentForm?.invalid) {
      currentForm.markAllAsTouched();
      this.errorMessage.set('Por favor, completa los campos requeridos correctamente.');
      return;
    }

    // Marcar el paso actual como completado
    this.stepsCompleted.update(completed => {
      const newCompleted = [...completed];
      newCompleted[this.currentStep() - 1] = true;
      return newCompleted;
    });

    if (this.currentStep() < 5) {
      this.currentStep.update(step => step + 1);
      this.errorMessage.set(null);
    }
  }

  // Función para navegar a un paso específico
  navigateToStep(stepIndex: number): void {
    // Solo permitir si el paso está completado y es anterior al paso actual
    if (stepIndex < this.currentStep() && this.stepsCompleted()[stepIndex - 1]) {
      this.currentStep.set(stepIndex);
    }
  }

  // --- Getters para acceder fácilmente a los sub-formularios ---
  get account() { return this.registerForm.get('account') as FormGroup; }
  get access() { return this.registerForm.get('access') as FormGroup; }
  get business() { return this.registerForm.get('business') as FormGroup; }
  get configuration() { return this.registerForm.get('configuration') as FormGroup; }
  get plan() { return this.registerForm.get('plan') as FormGroup; }



  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  // Obtener el formulario del paso actual
  private getCurrentStepForm(): FormGroup | null {
    const stepNames = ['account', 'access', 'business', 'configuration', 'plan'];
    const currentStepName = stepNames[this.currentStep() - 1];
    return this.registerForm.get(currentStepName) as FormGroup;
  }

  // --- Lógica de Envío del Formulario (onSubmit) ---
  onSubmit(): void {
    this.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    this.isRegistering.set(true);
    this.errorMessage.set(null);

    const formValue = this.registerForm.getRawValue();

    const payload: RegisterPayload = {
      firstName: formValue.account.firstName,
      lastName: formValue.account.lastName,
      email: formValue.access.email,
      password: formValue.access.passwordGroup.password,
      organizationName: formValue.business.companyName,
      rnc: formValue.configuration.taxId,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isRegistering.set(false);
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage.set('El correo electrónico ya está registrado. Por favor usa otro correo.');
        } else if (err.status === 400 && err.error?.details) {
          this.handleFieldErrors(err.error.details);
        } else {
          this.errorMessage.set(err.error?.message || 'Ocurrió un error inesperado durante el registro.');
        }
        this.isRegistering.set(false);
      }
    });
  }

  private markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(subControl => {
          subControl.markAsTouched();
        });
      } else {
        control.markAsTouched();
      }
    });
  }

  private handleFieldErrors(details: any[]) {
    let firstErrorStep = 5; // Start from last step

    details.forEach((err: any) => {
      const field = err.field;
      const control = this.findControlInForm(field);

      if (control) {
        control.setErrors({ serverError: err.message });
        const step = this.getStepForField(field);
        if (step < firstErrorStep) firstErrorStep = step;
      }
    });

    if (firstErrorStep < 5) {
      this.currentStep.set(firstErrorStep);
      this.errorMessage.set('Por favor, corrige los errores en los campos resaltados.');
    } else {
      this.errorMessage.set('Por favor, completa todos los campos requeridos correctamente.');
    }
  }

  private findControlInForm(controlPath: string): AbstractControl | null {
    const paths = controlPath.split('.');
    let currentControl: AbstractControl | null = this.registerForm;

    for (const path of paths) {
      if (currentControl instanceof FormGroup) {
        currentControl = currentControl.get(path);
      } else {
        return null;
      }
    }
    return currentControl;
  }

  private getStepForField(field: string): number {
    if (field.startsWith('account')) return 1;
    if (field.startsWith('access')) return 2;
    if (field.startsWith('business')) return 3;
    if (field.startsWith('configuration')) return 4;
    return 5; // plan
  }
}