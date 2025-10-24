import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { immediateProvider } from 'rxjs/internal/scheduler/immediateProvider';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.serice';

@Component({
  selector: 'app-view-music',
  standalone: false,
  templateUrl: './view-music.component.html',
  styleUrl: './view-music.component.css'
})
export class ViewMusicComponent implements OnInit, OnDestroy {
  musicList: any[] = [];
  currentAudio: HTMLAudioElement | null = null;
  currentlyPlayingId: string | null = null;
  isAdmin: boolean = false;
  isUser: boolean = false;

  constructor(private musicService: MusicService, private auth: AuthService, private notificationsService: NotificationService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('userRole');
    this.isAdmin = role === 'ROLE_ADMIN';
    this.isUser = role === 'ROLE_USER';
    this.loadMusic();
  }

  loadMusic(): void {
    this.musicService.getAllMusic().subscribe({
      next: (data) => {
        this.musicList = data;
      },
      error: (err) => {
        console.error('Error loading music:', err);
      }
    });
  }

  getGenres(genreList: any[]): string {
    if (!genreList || genreList.length === 0) return 'No genre';
    const filtered = genreList.filter(g => g); 
    return filtered.length ? filtered.join(', ') : 'No genre';
  }

  playMusic(music: any): void {
    // Ako je već neka pesma aktivna - zaustavi je
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentlyPlayingId = null;
    }

    // Pusti novu
    console.log(music.genre)

    this.currentAudio = new Audio(music.url);
    this.currentAudio.play();
    this.currentlyPlayingId = music.musicId;

    // Kada završi pesma
    this.currentAudio.onended = () => {
      this.currentlyPlayingId = null;
    };
  }

  stopMusic(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentlyPlayingId = null;
    }
  }

  ngOnDestroy(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  subscribeOnGenres(music: any): void {
    const userId = this.auth.user?.sub
    if (!userId) return;
    console.log(userId)
    console.log(music.genre)
    if (music.genre && music.genre.length) {
    
      const genres = music.genre.filter((g: any) => g);

      genres.forEach((genre: string) => {
        this.notificationsService.subscribeUser(userId, 'genre', genre).subscribe({
          next: () => console.log(`Subscribed to genre: ${genre}`),
          error: (err) => console.error(`Error subscribing to genre ${genre}:`, err)
        });
      });
    } else {
      console.log('No genres to subscribe to.');
    }
    }
} 
