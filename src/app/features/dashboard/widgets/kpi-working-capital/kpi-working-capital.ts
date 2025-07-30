import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, TrendingDown, Minus } from 'lucide-angular';
import { Kpi } from '../../../../core/models/finance'; // Reutilizamos el modelo de datos de KPI

@Component({
  selector: 'app-kpi-working-capital',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './kpi-working-capital.html',
  styleUrls: ['../kpi-roe/kpi-roe.scss'], // Reutiliza los estilos del KPI de ROE
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiWorkingCapital {
  // Recibe los datos específicos para este KPI desde el componente padre
  @Input({ required: true }) data!: Kpi;

  // Íconos para la plantilla
  protected readonly TrendingUpIcon = TrendingUp;
  protected readonly TrendingDownIcon = TrendingDown;
  protected readonly NeutralIcon = Minus;

  /**
   * Determina qué ícono de tendencia mostrar basado en el valor de 'change'.
   * @returns El objeto del ícono correspondiente (TrendingUp, TrendingDown, o Minus).
   */
  getChangeIcon() {
    if (!this.data || !this.data.comparisonValue) {
      return this.NeutralIcon;
    }
    // Asumimos que un cambio positivo en el capital de trabajo es bueno
    return this.data.isPositive ? this.TrendingUpIcon : this.TrendingDownIcon;
  }

  /**
   * Determina la clase CSS para el color del texto de tendencia.
   * @returns Una clase de CSS: 'positive', 'negative', o 'neutral'.
   */
  getChangeClass() {
    if (!this.data || !this.data.comparisonValue) {
      return 'neutral';
    }
    return this.data.isPositive ? 'positive' : 'negative';
  }
}