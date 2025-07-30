import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Filter, FileDown, Calendar } from 'lucide-angular';

interface LedgerLine {
  date: string;
  entryNumber: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

@Component({
  selector: 'app-general-ledger-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './general-ledger.page.html',
  styleUrls: ['./general-ledger.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralLedgerPage {
  protected readonly FilterIcon = Filter;
  protected readonly ExportIcon = FileDown;
  protected readonly CalendarIcon = Calendar;

  selectedAccount = signal<{ code: string; name: string }>({ code: '1010-01', name: 'Main Bank Account' });

  // Datos simulados para la cuenta seleccionada
  ledgerLines = signal<LedgerLine[]>([
    { date: 'Jul 1, 2025', entryNumber: 'OPEN', description: 'Opening Balance', debit: null, credit: null, balance: 50000.00 },
    { date: 'Jul 15, 2025', entryNumber: 'JE-2025-015', description: 'Payment from Client A', debit: 15000.00, credit: null, balance: 65000.00 },
    { date: 'Jul 28, 2025', entryNumber: 'JE-2025-002', description: 'Payroll Payment - Q1 July', debit: null, credit: 15200.00, balance: 49800.00 },
    { date: 'Jul 30, 2025', entryNumber: 'JE-2025-021', description: 'Payment to Supplier B', debit: null, credit: 5000.00, balance: 44800.00 },
  ]);

  initialBalance = signal(50000.00);
  finalBalance = signal(44800.00);
}