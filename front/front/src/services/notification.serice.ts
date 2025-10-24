import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = "https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com";

  constructor(private http: HttpClient) {}

  /**
   * Pretplata korisnika na umetnika ili žanr
   * @param userId - ID korisnika
   * @param type - tip pretplate ('artist' | 'genre')
   * @param target - ID umetnika ili naziv žanra
   */
  subscribeUser(userId: string, type: string, target: string): Observable<any> {
    const body = { userId, type, targetId: target };
    return this.http.post(`${this.apiUrl}/subscribe`, body);
  }

  /**
   * Kreira notifikaciju za korisnike
   * @param userId - ID korisnika kome ide notifikacija
   * @param type - tip ('songAdd', 'artistAdd', 'artistSongAdd')
   * @param target - ID umetnika, naziv žanra ili drugi parametar
   */
  createNotification(userId: string, type: string, target: string): Observable<any> {
    const body = { userId, type, targetId: target };
    return this.http.post(`${this.apiUrl}/notify`, body);
  }

  /**
   * Dobavlja sve notifikacije korisnika
   * @param userId - ID korisnika
   */
  getUserNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getUserNotifications/${userId}`);
  }
}
