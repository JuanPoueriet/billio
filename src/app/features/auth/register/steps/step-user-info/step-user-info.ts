import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Phone, CaseSensitive } from 'lucide-angular';

@Component({
  selector: 'app-step-user-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './step-user-info.html',
  styleUrls: ['./step-user-info.scss']
})
export class StepUserInfo {
  @Input() parentForm!: FormGroup;
  protected readonly UserIcon = User;
  protected readonly PhoneIcon = Phone;
  protected readonly JobIcon = CaseSensitive;

  get firstName() { return this.parentForm.get('firstName'); }
  get lastName() { return this.parentForm.get('lastName'); }
}