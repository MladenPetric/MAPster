import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'https://orbnzq4ol9.execute-api.eu-central-1.amazonaws.com/artists';

  constructor(private http: HttpClient) {}

  createArtist(artist: Artist): Observable<any> {
    return this.http.post<any>(this.apiUrl, artist);
  }
}