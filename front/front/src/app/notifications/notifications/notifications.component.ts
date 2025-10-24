import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.serice';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  notifications: any[] = [];
  userId: string | undefined;
  
  constructor(private notificationService: NotificationService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.user?.sub
    if (this.userId) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications(this.userId!).subscribe({
      next: (data) => {
        this.notifications = data || [];
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
      }
    });
  }

  markAsRead(notification: any): void {
    notification.read = true;
  }
}
