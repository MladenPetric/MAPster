import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../../services/artist.service';
import { AlbumService } from '../../../services/album.service';
import { MusicService } from '../../../services/music.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetArtist } from '../../../models/get.artist.model';
import { GetAlbum } from '../../../models/get.album.model';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';



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
  isUploading: boolean = false;
  uploadProgress: number = 0;

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
      newAlbumName: [''],
       newAlbumGenre: [''],
      file: [null, Validators.required]
    });

    // Učitaj umetnike i albume sa BEKA
    this.artistService.getArtists().subscribe(res => this.artists = res);
    this.albumService.getAlbums().subscribe(res => this.albums = res);


    this.uploadForm.get('album')?.valueChanges.subscribe(value => {
    const newAlbumNameControl = this.uploadForm.get('newAlbumName');
    const newAlbumGenreControl = this.uploadForm.get('newAlbumGenre');
    if (value) {
      newAlbumNameControl?.disable({ emitEvent: false });
      newAlbumGenreControl?.disable({ emitEvent: false });
      newAlbumNameControl?.setValue('');
      newAlbumGenreControl?.setValue('');
    } else {
      newAlbumNameControl?.enable({ emitEvent: false });
      newAlbumGenreControl?.enable({ emitEvent: false });
    }
  });

  // 2. Ako korisnik unese novo ime albuma, onemogući izbor postojećeg albuma
  this.uploadForm.get('newAlbumName')?.valueChanges.subscribe(value => {
    const albumControl = this.uploadForm.get('album');
    const newAlbumGenreControl = this.uploadForm.get('newAlbumGenre');
    if (value) {
      albumControl?.disable({ emitEvent: false });
      newAlbumGenreControl?.enable({ emitEvent: false });
    } else {
      albumControl?.enable({ emitEvent: false });
      newAlbumGenreControl?.disable({ emitEvent: false });
      newAlbumGenreControl?.setValue('');
    }
  });

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

    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    const maxSizeMB = 100;

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
    	const formValue = this.uploadForm.getRawValue();

		// Privremeno omogućavamo onemogućene kontrole zbog validacije
		this.uploadForm.get('album')?.enable({ emitEvent: false });
		this.uploadForm.get('newAlbumName')?.enable({ emitEvent: false });

		if (!this.uploadForm.valid || !this.selectedFile) {
			console.error('Molimo popunite sva obavezna polja i izaberite fajl.');
			this.isUploading = false;
			// Vraćamo kontrole u prvobitno stanje pre return-a
			if (formValue.album) this.uploadForm.get('newAlbumName')?.disable({ emitEvent: false });
			if (formValue.newAlbumName) this.uploadForm.get('album')?.disable({ emitEvent: false });
			return;
		}
		
		// Vraćamo kontrole u prvobitno stanje i proveravamo izbor
		const albumControlValue = formValue.album;
		const newAlbumNameControlValue = formValue.newAlbumName;

		if (albumControlValue) {
			this.uploadForm.get('newAlbumName')?.disable({ emitEvent: false });
		} else if (newAlbumNameControlValue) {
			this.uploadForm.get('album')?.disable({ emitEvent: false });
		} else {
			// Ako ni jedno ni drugo nije popunjeno, vraćamo error
			console.error('Molimo odaberite postojeći album ili unesite novo ime albuma.');
			this.isUploading = false;
			return;
		}

		this.isUploading = true;
		const file = this.selectedFile;
		
		// 1. Definišemo Observable koji će vratiti ID albuma (postojećeg ili novokreiranog)
		const albumId$: Observable<string> = (newAlbumNameControlValue)
			? this.albumService.createAlbum(
				newAlbumNameControlValue, 
				formValue.newAlbumGenre // Žanrovi pesme su žanrovi albuma
			).pipe(
				switchMap(newAlbum => {
					// Nakon uspešnog kreiranja albuma, dodajemo ga u listu i vraćamo njegov ID
					this.albums.push(newAlbum);
					// Koristimo .id, što se podudara sa GetAlbum interfejsom u album.service.ts
					return of(newAlbum.albumId); 
				}),
				catchError(err => {
					console.error('Greška pri kreiranju novog albuma:', err);
					// Vraćamo prazan Observable da prekinemo lanac
					return of(null as any); 
				})
			)
			// Ako se kreira novi album, ID je string; ako se bira postojeći, ID je ili ID string ili objekat sa .id
			: of(albumControlValue?.id || albumControlValue || ''); 

		// 2. Lančamo operaciju uploada nakon dobijanja ID-a albuma
		albumId$.pipe(
			switchMap(albumId => {
				if (!albumId) {
					// Ako je kreiranje albuma propalo, prekidamo dalji upload
					this.isUploading = false;
					return of(null as any); 
				}

				// A. Poziv za dobijanje Presigned URL-a
				return this.musicService.getPresignedUrl(file.name, file.type).pipe(
					switchMap(response => {
						const { uploadUrl, musicId } = response;

						// B. Upload fajla na S3
						return this.musicService.uploadFileToS3(uploadUrl, file).pipe(
							switchMap(event => {
								if (event.type === HttpEventType.UploadProgress) {
									const progress = event as HttpProgressEvent;
									if (progress.total) {
										this.uploadProgress = Math.round((progress.loaded / progress.total) * 100);
									}
									return of(null); // Nastavljamo sa progresom
								}
								// C. Kada je S3 upload završen (HttpEventType.Response)
								if (event.type === HttpEventType.Response) {
									const artistValue = formValue.artist;
									
									// Slanje metapodataka
									const metadata = {
										title: formValue.title,
										// Izvlačenje ID-a izvođača
										artist: artistValue?.id || artistValue, 
										// Koristimo ID albuma koji smo dobili u 1. koraku
										album: albumId, 
										genre: formValue.genre,
										musicId: musicId
									};

									console.log('Slanje metapodataka:', metadata);
									return this.musicService.saveMetadata(metadata);
								}
								return of(null);
							})
						);
					})
				);
			}),
			catchError(err => {
				console.error('Greška u pipeline-u slanja podataka:', err);
				this.isUploading = false;
				return of(null);
			})
		).subscribe({
			// Sada očekujemo samo finalni odgovor iz saveMetadata ili null iz među-koraka
			next: (res) => {
				// Res je konačni odgovor iz saveMetadata. Ako nije null, sve je uspelo.
				if (res) {
					console.log('Muzika uspešno uploadovana!');
					this.uploadForm.reset();
					this.selectedFile = null;
					this.uploadProgress = 0;
				}
			},
			error: (err) => {
				console.error("Konačna greška nakon svih pokušaja:", err);
				this.isUploading = false;
			},
			complete: () => {
				this.isUploading = false;
				console.log("Upload proces završen.");
			}
		});
  }

}

