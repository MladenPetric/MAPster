import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAlbum } from '../models/get.album.model';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private apiUrl =
    ' https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/albums';

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

  getAlbumById(albumId: string): Observable<any> {
    return this.http.get<any>(
      `https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/albums/${albumId}`
    );
  }

  getSongsByAlbum(albumId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/songs/${albumId}`
    );
  }
}
