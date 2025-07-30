import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Check, Clock, Bell } from 'lucide-angular';

// Tipos de datos para la página
type WorkItemStatus = 'pending' | 'in-progress' | 'completed';
type WorkItemType = 'tasks' | 'approvals' | 'notifications';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: WorkItemStatus;
  link: string;
}

@Component({
  selector: 'app-my-work-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './my-work.page.html',
  styleUrls: ['./my-work.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkPage {
  // Íconos para la plantilla
  protected readonly TaskIcon = Check;
  protected readonly ApprovalIcon = Clock;
  protected readonly NotificationIcon = Bell;

  // Señal para controlar la pestaña activa
  activeTab = signal<WorkItemType>('tasks');

  // Datos simulados
  tasks = signal<WorkItem[]>([
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-01', title: 'Reconcile main bank account', description: 'Reconcile movements for July 2025.', dueDate: 'Jul 31, 2025', status: 'in-progress', link: '/app/treasury/reconciliation/manual' },
    { id: 'T-02', title: 'Prepare tax declaration', description: 'Gather all documents for the IT-1 declaration.', dueDate: 'Aug 15, 2025', status: 'pending', link: '/app/taxes/declarations' },
  ]);

  approvals = signal<WorkItem[]>([
    { id: 'A-01', title: 'Approve Purchase Order #PO-056', description: 'Purchase of new IT equipment for $2,500.', dueDate: 'Jul 28, 2025', status: 'pending', link: '/app/approvals' },
  ]);

  notifications = signal<WorkItem[]>([
    { id: 'N-01', title: 'Invoice #INV-003 is overdue', description: 'The invoice for "Creative Services" is 5 days overdue.', dueDate: 'Jul 21, 2025', status: 'pending', link: '/app/invoices/INV-003' },
  ]);

  setActiveTab(tab: WorkItemType): void {
    this.activeTab.set(tab);
  }

  getStatusClass(status: WorkItemStatus): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
    }
  }
}