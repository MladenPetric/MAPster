import { Component } from '@angular/core';
import { ArtistService } from '../../../services/artist.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.serice';
import { filter } from 'rxjs';

@Component({
  selector: 'app-artist-details',
  standalone: false,
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css',
})
export class ArtistDetailsComponent {
  artistId!: string;
  artistName = '';
  artistGenres: string[] = [];
  songs: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.artistId = this.route.snapshot.paramMap.get('artistId')!;

    // Dobavi podatke o artistu
    this.artistService.getArtistById(this.artistId).subscribe({
      next: (artist) => {
        this.artistName = artist.name;
        this.artistGenres = artist.genres || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri dohvatanju artista:', err);
        this.loading = false;
      },
    });
    // Dobavi pesme od artist-a
    this.artistService.getSongsByArtist(this.artistId).subscribe({
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
  subscribeOnArtist(): void {

    this.authService.user$.pipe(
          filter(u => !!u)).subscribe(
              user => {
                const userId = user.username
                if (!userId || !this.artistId) return;
                  console.log(userId)
                    console.log(this.artistId)
                  this.notificationService.subscribeUser(userId, 'artist', this.artistId).subscribe({
                  next: () => console.log(`Subscribed to artist: ${this.artistId}`),
                  error: (err) => console.error(`Error subscribing to artist ${this.artistId}:`, err)
                });
              }
          )
  }
}
