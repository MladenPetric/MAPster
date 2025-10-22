import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter } from 'rxjs';

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
          .pipe(filter(role => !!role))
          .subscribe(role => {
            router.navigate([`/${role.toLowerCase()}`]).then();
            localStorage.setItem('userRole', `ROLE_${role.toUpperCase()}`);
          });
  }

  onLogin() {
    this.auth.logIn(this.username, this.password);
  }

}
