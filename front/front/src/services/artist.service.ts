import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {
  private apiUrl = 'https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/artists';

  constructor(private http: HttpClient) {}

  createArtist(artist: Artist): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist);
  }

  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getArtistById(artistId: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${artistId}`);
  }

  getSongsByArtist(artistId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/songs/artist/${artistId}`
    );
  }
}
