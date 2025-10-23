import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  userRole: string | null = null;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userRole$.subscribe(role => this.userRole = role);
  }

  onLogout() {
      this.auth.logOut();
      this.router.navigate(['/login']);
    }
}
