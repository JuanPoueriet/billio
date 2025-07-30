import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-step-plan-selection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './step-plan-selection.html',
  styleUrls: ['./step-plan-selection.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepPlanSelection {
  @Input() parentForm!: FormGroup;
  protected readonly CheckIcon = Check;

  selectPlan(plan: string) {
    this.parentForm.get('plan')?.setValue(plan);
  }
}