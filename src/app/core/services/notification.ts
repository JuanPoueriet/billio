import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warn' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = signal<Notification[]>([]);

  show(message: string, type: NotificationType = 'info', duration: number = 4000) {
    const newNotification = { message, type, duration };
    this.notifications.update(current => [...current, newNotification]);
    setTimeout(() => this.close(newNotification), duration);
  }

  close(notification: Notification) {
    this.notifications.update(current => current.filter(n => n !== notification));
  }
}