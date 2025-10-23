import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAlbum } from '../models/get.album.model';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private apiUrl = 'https://zv5af32bcd.execute-api.eu-central-1.amazonaws.com/albums';

  constructor(private http: HttpClient) {}

  getAlbums(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAlbum(name: string, genre: string): Observable<GetAlbum> {
    const payload = {
      name: name,
      genre: genre,
    };
    return this.http.post<GetAlbum>(this.apiUrl, payload);
  }
}