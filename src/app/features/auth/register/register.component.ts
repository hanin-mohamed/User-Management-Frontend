import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
})
export class RegisterComponent {
  fullName = '';
  username = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = ''; this.success = '';
    this.loading = true;
    this.auth.register({ fullName: this.fullName, username: this.username, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.success = 'Registered successfully. Please login.';
          setTimeout(() => this.router.navigateByUrl('/login'), 800);
        },
        error: (e) => {
          this.error = e?.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }
}
