import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, BellOff } from 'lucide-angular';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string; // Fecha en formato ISO para poder ordenar
  read: boolean;
}

interface NotificationGroup {
  period: string;
  notifications: Notification[];
}

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPage {
  // Íconos
  protected readonly MarkAllReadIcon = Check;
  protected readonly NoNotificationsIcon = BellOff;

  // Datos simulados
  notifications = signal<Notification[]>([
    { id: 'N-01', title: 'Factura #FAC-003 ha vencido', description: 'La factura para "Servicios Creativos" venció hace 5 días.', timestamp: '2025-07-21T10:00:00Z', read: false },
    { id: 'N-02', title: 'Pago recibido', description: 'Se recibió un pago de $350.00 para la factura #FAC-002.', timestamp: '2025-07-25T14:30:00Z', read: false },
    { id: 'N-03', title: 'Producto con bajo stock', description: 'El producto "Mouse Inalámbrico" tiene solo 8 unidades restantes.', timestamp: '2025-07-25T09:00:00Z', read: true },
    { id: 'N-04', title: 'Nueva Orden de Compra para aprobar', description: 'La OC #OC-057 requiere tu aprobación.', timestamp: '2025-07-24T18:00:00Z', read: true },
  ]);

  notificationGroups = computed(() => this.groupNotificationsByDate(this.notifications()));

  private groupNotificationsByDate(notifications: Notification[]): NotificationGroup[] {
    const groups: { [key: string]: Notification[] } = {
      'Hoy': [],
      'Ayer': [],
      'Esta Semana': [],
      'Anteriores': [],
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    for (const notification of notifications) {
      const notificationDate = new Date(notification.timestamp);
      if (notificationDate.toDateString() === today.toDateString()) {
        groups['Hoy'].push(notification);
      } else if (notificationDate.toDateString() === yesterday.toDateString()) {
        groups['Ayer'].push(notification);
      } else if (notificationDate > oneWeekAgo) {
        groups['Esta Semana'].push(notification);
      } else {
        groups['Anteriores'].push(notification);
      }
    }

    return Object.keys(groups)
      .map(period => ({ period, notifications: groups[period] }))
      .filter(group => group.notifications.length > 0);
  }

  markAsRead(notificationId: string): void {
    this.notifications.update(notifications =>
      notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    console.log(`Marking notification ${notificationId} as read.`);
  }

  markAllAsRead(): void {
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, read: true }))
    );
    console.log('Marking all notifications as read.');
  }
}