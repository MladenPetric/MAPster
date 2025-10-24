import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAdminComponent } from './home/home-admin/home-admin.component';
import { HomeUserComponent } from './home/home-user/home-user.component';
import { CreateArtistComponent } from './artist/create-artist/create-artist.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UploadMusicComponent } from './music/upload-music/upload-music.component';
import { AlbumDetailsComponent } from './album/album-details/album-details.component';
import { ArtistDetailsComponent } from './artist/artist-details/artist-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'album/:albumId', component: AlbumDetailsComponent },
  { path: 'artist/:artistId', component: ArtistDetailsComponent },
  {
    path: 'admin',
    component: HomeAdminComponent,
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: 'create-artist', component: CreateArtistComponent },
      { path: 'upload-music', component: UploadMusicComponent },
    ],
  },
  {
    path: 'user',
    component: HomeUserComponent,
    data: { roles: ['ROLE_USER'] },
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
