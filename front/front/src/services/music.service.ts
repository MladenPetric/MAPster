import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private apiUrl = 'https://uii5ovbbv3.execute-api.eu-central-1.amazonaws.com/music';

  constructor(private http: HttpClient) {}

  uploadMusic(trackData: any): Observable<any> {
    return this.http.post(this.apiUrl, trackData);
  }
}