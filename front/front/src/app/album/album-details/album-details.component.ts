import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../../../services/album.service';
@Component({
  selector: 'app-album-details',
  standalone: false,
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css',
})
export class AlbumDetailsComponent {
  albumId!: string;
  albumName = '';
  albumGenre = '';
  songs: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private albumService: AlbumService
  ) {}

  ngOnInit(): void {
    this.albumId = this.route.snapshot.paramMap.get('albumId')!;

    // Dobavi ime albuma
    this.albumService.getAlbumById(this.albumId).subscribe({
      next: (album) => {
        this.albumName = album.name;
        this.albumGenre = album.genre;
      },
      error: (err) => {
        console.error('Greška pri dohvatanju albuma:', err);
      },
    });

    this.albumService.getSongsByAlbum(this.albumId).subscribe({
      next: (songs) => {
        this.songs = songs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri učitavanju pesama:', err);
        this.loading = false;
      },
    });
  }
}
