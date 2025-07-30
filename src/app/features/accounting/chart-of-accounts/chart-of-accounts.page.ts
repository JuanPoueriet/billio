import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PlusCircle, Filter, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

type TipoCuenta = 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingresos' | 'Gastos';

interface GlAccount {
  id: string;
  code: string;
  name: string;
  type: TipoCuenta;
  balance: number;
  isParent: boolean;
  level: number;
  children?: GlAccount[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-chart-of-accounts-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule],
  templateUrl: './chart-of-accounts.page.html',
  styleUrls: ['./chart-of-accounts.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartOfAccountsPage {
  protected readonly PlusCircleIcon = PlusCircle;
  protected readonly FilterIcon = Filter;
  protected readonly MoreHorizontalIcon = MoreHorizontal;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly ChevronDownIcon = ChevronDown;

  accounts = signal<GlAccount[]>([
    {
      id: '1',
      code: '1',
      name: 'Activos',
      type: 'Activo',
      balance: 275000,
      isParent: true,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: '1-1',
          code: '1010',
          name: 'Efectivo y Equivalentes',
          type: 'Activo',
          balance: 75000,
          isParent: true,
          level: 1,
          isExpanded: true,
          children: [
            {
              id: '1-1-1',
              code: '1010-01',
              name: 'Cuenta Bancaria Principal',
              type: 'Activo',
              balance: 65000,
              isParent: false,
              level: 2,
            },
            {
              id: '1-1-2',
              code: '1010-02',
              name: 'Caja Chica',
              type: 'Activo',
              balance: 10000,
              isParent: false,
              level: 2,
            },
          ],
        },
        {
          id: '1-2',
          code: '1200',
          name: 'Cuentas por Cobrar',
          type: 'Activo',
          balance: 75000,
          isParent: false,
          level: 1,
        },
        {
          id: '1-3',
          code: '1300',
          name: 'Inventarios',
          type: 'Activo',
          balance: 50000,
          isParent: false,
          level: 1,
        },
        {
          id: '1-4',
          code: '1500',
          name: 'Propiedades, Planta y Equipo',
          type: 'Activo',
          balance: 75000,
          isParent: false,
          level: 1,
        },
      ],
    },
    {
      id: '2',
      code: '2',
      name: 'Pasivos',
      type: 'Pasivo',
      balance: 105000,
      isParent: true,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: '2-1',
          code: '2100',
          name: 'Cuentas por Pagar',
          type: 'Pasivo',
          balance: 60000,
          isParent: false,
          level: 1,
        },
        {
          id: '2-2',
          code: '2200',
          name: 'Préstamos Bancarios',
          type: 'Pasivo',
          balance: 45000,
          isParent: false,
          level: 1,
        },
      ],
    },
    {
      id: '3',
      code: '3',
      name: 'Patrimonio',
      type: 'Patrimonio',
      balance: 70000,
      isParent: true,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: '3-1',
          code: '3100',
          name: 'Capital Social',
          type: 'Patrimonio',
          balance: 50000,
          isParent: false,
          level: 1,
        },
        {
          id: '3-2',
          code: '3200',
          name: 'Utilidades Retenidas',
          type: 'Patrimonio',
          balance: 20000,
          isParent: false,
          level: 1,
        },
      ],
    },
    {
      id: '4',
      code: '4',
      name: 'Ingresos',
      type: 'Ingresos',
      balance: 150000,
      isParent: true,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: '4-1',
          code: '4100',
          name: 'Ventas de Productos',
          type: 'Ingresos',
          balance: 100000,
          isParent: false,
          level: 1,
        },
        {
          id: '4-2',
          code: '4200',
          name: 'Servicios Prestados',
          type: 'Ingresos',
          balance: 50000,
          isParent: false,
          level: 1,
        },
      ],
    },
    {
      id: '5',
      code: '5',
      name: 'Gastos',
      type: 'Gastos',
      balance: 85000,
      isParent: true,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: '5-1',
          code: '5100',
          name: 'Gastos de Personal',
          type: 'Gastos',
          balance: 40000,
          isParent: false,
          level: 1,
        },
        {
          id: '5-2',
          code: '5200',
          name: 'Servicios Públicos',
          type: 'Gastos',
          balance: 15000,
          isParent: false,
          level: 1,
        },
        {
          id: '5-3',
          code: '5300',
          name: 'Publicidad y Marketing',
          type: 'Gastos',
          balance: 10000,
          isParent: false,
          level: 1,
        },
        {
          id: '5-4',
          code: '5400',
          name: 'Gastos Generales y Administrativos',
          type: 'Gastos',
          balance: 20000,
          isParent: false,
          level: 1,
        },
      ],
    },
  ]);

  toggleExpand(account: GlAccount): void {
    account.isExpanded = !account.isExpanded;
  }
}
