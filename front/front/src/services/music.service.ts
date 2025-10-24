import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl =
    'https://wb71odl9aa.execute-api.eu-central-1.amazonaws.com/music';

  constructor(private http: HttpClient) {}

  getPresignedUrl(filename: string, contentType: string): Observable<any> {
    const body = { filename, contentType };
    return this.http.post(`${this.apiUrl}/presigned`, body);
  }

  uploadFileToS3(uploadUrl: string, file: File): Observable<HttpEvent<any>> {
    const req = new HttpRequest('PUT', uploadUrl, file, {
      headers: new HttpHeaders({}),
      reportProgress: true,
    });
    return this.http.request(req);
  }

  saveMetadata(metadata: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/metadata`, metadata);
  }
}
