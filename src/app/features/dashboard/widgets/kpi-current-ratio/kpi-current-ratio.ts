import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';
import { Kpi } from '../../../../core/models/finance';

@Component({
  selector: 'app-kpi-current-ratio',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './kpi-current-ratio.html',
  styleUrls: ['../kpi-roe/kpi-roe.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCurrentRatio {
  @Input({ required: true }) data!: Kpi;
  protected readonly TrendingUpIcon = TrendingUp;
  protected readonly TrendingDownIcon = TrendingDown;
}