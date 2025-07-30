import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';
import { Kpi } from '../../../../core/models/finance'; // Reutilizamos el modelo de datos de KPI

@Component({
  selector: 'app-kpi-roe',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './kpi-roe.html',
  styleUrls: ['./kpi-roe.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiRoe {
  // Recibe los datos específicos para este KPI
  @Input({ required: true }) data!: Kpi;

  // Íconos para la plantilla
  protected readonly TrendingUpIcon = TrendingUp;
  protected readonly TrendingDownIcon = TrendingDown;
}