import { Component, OnInit } from '@angular/core';
import {
  FilterService,
  FilterResponse,
} from '../../../services/filter.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home-user',
  standalone: false,
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css'],
})
export class HomeUserComponent implements OnInit {
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
  albums: any[] = [];
  artists: any[] = [];
  loading = false;
  showChildContent = false;

  constructor(private filterService: FilterService, private router: Router) {}

  ngOnInit() {
    this.loadData(); // učitavamo sve kad se stranica otvori

     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Ako ruta sadrži 'view-music' ili 'notifications', prikaži child content
        if (event.url.includes('/user/view-music') || event.url.includes('/user/notifications')) {
          this.showChildContent = true;
        } else {
          this.showChildContent = false;
        }
      });
  }

  onGenreChange(event: any) {
    this.selectedGenre = event.target.value;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.filterService.getFiltered(this.selectedGenre).subscribe({
      next: (res: FilterResponse) => {
        this.albums = res.albums || [];
        this.artists = res.artists || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška prilikom učitavanja:', err);
        this.loading = false;
      },
    });
  }
}
