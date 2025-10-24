import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,} from '@angular/forms';
import { ArtistService } from '../../../services/artist.service';
import { Artist } from '../../../models/artist.model';
import { NotificationService } from '../../../services/notification.serice';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-artist',
  standalone: false,
  templateUrl: './create-artist.component.html',
  styleUrl: './create-artist.component.css'
})
export class CreateArtistComponent {
  artistForm: FormGroup;

  genresList: string[] = [
    'Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Reggae', 'Blues'
  ];

  constructor(private fb: FormBuilder, private artistService: ArtistService, private notificationService: NotificationService, private authService: AuthService) {

      this.artistForm = this.fb.group({
      name: ['', Validators.required],
      biography: ['', Validators.required],
      genres: [[], Validators.required] // multi-select
    });
  }

  onSubmit() {
    if (this.artistForm.valid) {
      const artist: Artist = this.artistForm.value;

      this.artistService.createArtist(artist).subscribe({
        next: (res) => {
          alert('Artist successfully created!');

          const userId = this.authService.user?.sub // trenutno ulogovani korisnik
          if (userId && artist.genres?.length) {
            artist.genres.forEach((genre: string) => {
              this.notificationService.createNotification(
                userId,
                'artistAdd',
                genre
              ).subscribe({
                next: () => console.log(`Notification created for genre: ${genre}`),
                error: (err) => console.error('Error creating notification:', err)
              });
            });
          }


          this.artistForm.reset();
        },
        error: (err) => {
          alert('Error creating artist');
          console.error(err);
        }
      });
    }
  }

  onGenreChange(event: any) {
  const selectedGenres = this.artistForm.value.genres || [];
  if (event.target.checked) {
    selectedGenres.push(event.target.value);
  } else {
    const index = selectedGenres.indexOf(event.target.value);
    if (index > -1) selectedGenres.splice(index, 1);
  }
  this.artistForm.patchValue({ genres: selectedGenres });
}
}
