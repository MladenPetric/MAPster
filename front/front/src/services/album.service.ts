import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'https://uii5ovbbv3.execute-api.eu-central-1.amazonaws.com/albums';

  constructor(private http: HttpClient) {}

  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}