import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';
import { Kpi } from '../../../../core/models/finance';

@Component({
  selector: 'app-kpi-roa',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './kpi-roa.html',
  styleUrls: ['../kpi-roe/kpi-roe.scss'], // Reutiliza los estilos del KPI de ROE
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiRoa {
  @Input({ required: true }) data!: Kpi;
  protected readonly TrendingUpIcon = TrendingUp;
  protected readonly TrendingDownIcon = TrendingDown;
}