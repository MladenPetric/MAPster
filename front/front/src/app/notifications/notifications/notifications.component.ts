import { Component } from '@angular/core';
import { NotificationService } from '../../../services/notification.serice';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';

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
    this.authService.user$.pipe(
      filter(u => !!u)).subscribe(
        user => {
          this.userId = user.username
          if (this.userId) {
            this.loadNotifications();
          }
        }
      ) 
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
