import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
//   private apiUrl = 'https://YOUR_API_GATEWAY_ID.execute-api.eu-central-1.amazonaws.com/dev/artists';

//   constructor(private http: HttpClient) {}

//   createArtist(artist: Artist): Observable<any> {
//     return this.http.post<any>(this.apiUrl, artist);
//   }
}