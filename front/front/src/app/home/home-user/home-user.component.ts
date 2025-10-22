import { Component } from '@angular/core';

@Component({
  selector: 'app-home-user',
  standalone: false,
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css',
})
export class HomeUserComponent {
  genres = [
    'Pop',
    'Rock',
    'Hip-Hop',
    'Jazz',
    'Classical',
    'Electronic',
    'R&B',
    'Country',
    'Reggae',
    'Blues',
  ];
  selectedGenre = '';

  albums = [
    { title: 'Album 1', artist: 'Artist A', genre: 'Pop' },
    { title: 'Album 2', artist: 'Artist B', genre: 'Rock' },
    { title: 'Album 3', artist: 'Artist C', genre: 'Jazz' },
    { title: 'Album 4', artist: 'Artist D', genre: 'Electronic' },
    // dodaj više albuma
  ];

  artists = [
    { name: 'Artist A', genre: 'Pop' },
    { name: 'Artist B', genre: 'Rock' },
    { name: 'Artist C', genre: 'Jazz' },
    { name: 'Artist D', genre: 'Electronic' },
    // dodaj više umetnika
  ];

  get filteredAlbums() {
    if (!this.selectedGenre) return this.albums;
    return this.albums.filter((album) => album.genre === this.selectedGenre);
  }

  get filteredArtists() {
    if (!this.selectedGenre) return this.artists;
    return this.artists.filter((artist) => artist.genre === this.selectedGenre);
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.target.value;
  }
}
