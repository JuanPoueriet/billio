import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Lock } from 'lucide-angular';
@Component({
  selector: 'app-step-access', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './step-access.html', styleUrls: ['./step-access.scss']
})
export class StepAccess {
  @Input() parentForm!: FormGroup;
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;
  get passwordGroup() { return this.parentForm.get('passwordGroup') as FormGroup; }
}