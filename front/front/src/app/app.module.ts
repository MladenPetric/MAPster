import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeAdminComponent } from './home/home-admin/home-admin.component';
import { HomeUserComponent } from './home/home-user/home-user.component';
import { CreateArtistComponent } from './artist/create-artist/create-artist.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UploadMusicComponent } from './music/upload-music/upload-music.component';
import { 
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from '../services/auth.interceptor';
import { AlbumDetailsComponent } from './album/album-details/album-details.component';
import { ArtistDetailsComponent } from './artist/artist-details/artist-details.component';
import { ViewMusicComponent } from './music/view-music/view-music.component';
import { NotificationsComponent } from './notifications/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeAdminComponent,
    HomeUserComponent,
    CreateArtistComponent,
    LoginComponent,
    RegisterComponent,
    NavBarComponent,
    UploadMusicComponent,
    AlbumDetailsComponent,
    ArtistDetailsComponent,
    UploadMusicComponent,
    ViewMusicComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
