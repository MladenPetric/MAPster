import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';

export interface FilterResponse {
  genre: string;
  albums: Album[];
  artists: Artist[];
}
@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private apiUrl =
    'https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/filter';

  constructor(private http: HttpClient) {}

  getFiltered(genre?: string): Observable<FilterResponse> {
    let params = new HttpParams();
    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<FilterResponse>(this.apiUrl, { params });
  }
}
