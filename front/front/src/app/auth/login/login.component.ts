import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  role = '';
  userId = '';
  organization = '';

  constructor(private router: Router, private auth: AuthService) {
    auth.userRole$
          .pipe(
            tap(console.log.bind(console, "Role: ")),
            filter(role => !!role))
          .subscribe(role => {
            let path = role == 'ROLE_ADMIN' ? '/admin' : '/user';
            router.navigate([path]).then();
            localStorage.setItem('userRole', role);
          });
  }

  async onLogin() {
    await this.auth.logIn(this.username, this.password);
  }

}
