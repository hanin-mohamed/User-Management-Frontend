import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private token: TokenStorageService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (data) => {
        this.token.set(data.accessToken);
        this.router.navigateByUrl('/home');
      },
      error: (e) => {
        this.error = e?.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
