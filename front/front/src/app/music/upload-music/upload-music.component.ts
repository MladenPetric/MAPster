import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../../services/artist.service';
import { AlbumService } from '../../../services/album.service';
import { MusicService } from '../../../services/music.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetArtist } from '../../../models/get.artist.model';
import { GetAlbum } from '../../../models/get.album.model';



@Component({
  selector: 'app-upload-music',
  standalone: false,
  templateUrl: './upload-music.component.html',
  styleUrl: './upload-music.component.css'
})
export class UploadMusicComponent { 
  uploadForm!: FormGroup;
  artists: GetArtist[] = [];
  albums: GetAlbum[] = [];
  genres: string[] = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Reggae', 'Blues'];
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    private fb: FormBuilder,
    private musicService: MusicService,
    private artistService: ArtistService,
    private albumService: AlbumService
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      genre: this.fb.array([], Validators.required),
      artist: ['', Validators.required],
      album: [''],
      file: [null, Validators.required]
    });

    // Učitaj umetnike i albume sa BEKA
    this.artistService.getArtists().subscribe(res => this.artists = res);
    this.albumService.getAlbums().subscribe(res => this.albums = res);
  }

  onCheckboxChange(e: any) {
    const genresArray: FormArray = this.uploadForm.get('genre') as FormArray;
    if (e.target.checked) {
      genresArray.push(this.fb.control(e.target.value));
    } else {
      const index = genresArray.controls.findIndex(x => x.value === e.target.value);
      if (index >= 0) genresArray.removeAt(index);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileError = '';

    if (!file) return;

    // Ograničenja: samo mp3, wav i max 20MB
    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    const maxSizeMB = 20;

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Dozvoljeni formati: mp3, wav';
      this.selectedFile = null;
      return;
    }

    if (file.size / 1024 / 1024 > maxSizeMB) {
      this.fileError = 'Maksimalna veličina fajla: 20MB';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
    this.uploadForm.patchValue({ file: file });
  }

  submit() {
    if (!this.uploadForm.valid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('title', this.uploadForm.value.title);
    formData.append('artist', this.uploadForm.value.artist);
    formData.append('album', this.uploadForm.value.album || '');
    formData.append('file', this.selectedFile);

    this.uploadForm.value.genre.forEach((g: string) => formData.append('genre', g));

    this.musicService.uploadMusic(formData).subscribe({
      next: (res) => alert('Pesma uspešno postavljena!'),
      error: (err) => alert('Greška prilikom postavljanja pesme.')
    });
  }
  
}

