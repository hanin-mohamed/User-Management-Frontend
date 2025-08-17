import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { Router, RouterLink } from '@angular/router';
import { UserCreateRequest } from '../../core/model/userCreateRequest';
import { UserResponse } from '../../core/model/userResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HomeComponent implements OnInit {
  users: UserResponse[] = [];
  page = 0; size = 10; total = 0;
  loading = false; error = '';

  newUser: UserCreateRequest = { fullName: '', username: '', email: '', password: '', salary: null };

  constructor(
    private usersService: UsersService,
    private token: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.usersService.list(this.page, this.size).subscribe({
      next: (p) => {
        this.users = p.content;
        this.total = p.totalElements;
        this.loading = false;
      },
      error: (e) => { this.error = e?.error?.message || 'Failed to load'; this.loading = false; }
    });
  }

  logout() {
    this.token.clear();
    this.router.navigateByUrl('/login');
  }

  create() {
    if (!this.newUser.fullName || !this.newUser.username || !this.newUser.email || !this.newUser.password) return;
    this.usersService.create(this.newUser).subscribe({
      next: () => { this.newUser = { fullName: '', username: '', email: '', password: '', salary: null }; this.load(); },
      error: (e) => { this.error = e?.error?.message || 'Create failed'; }
    });
  }

  updateSalary(u: UserResponse) {
    const salaryNum = u.salary === null ? null : Number(u.salary);
    this.usersService.updateSalary(u.id, salaryNum).subscribe({
      next: (updated) => {
        const idx = this.users.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.users[idx] = updated;
      },
      error: (e) => { this.error = e?.error?.message || 'Update failed'; }
    });
  }

  remove(id: number) {
    if (!confirm('Delete this user?')) return;
    this.usersService.delete(id).subscribe({
      next: () => this.load(),
      error: (e) => { this.error = e?.error?.message || 'Delete failed'; }
    });
  }
exportExcel() {
  this.usersService.exportExcel().subscribe({
    next: (res) => {
      const blob = res.body!;
      let filename = 'users.xlsx';
      const cd = res.headers.get('Content-Disposition');
      if (cd) {
        const m = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(cd);
        if (m && m[1]) filename = m[1].replace(/['"]/g, '');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    },
    error: (e) => { this.error = e?.error?.message || 'Export failed'; }
  });
}

  prev() { if (this.page > 0) { this.page--; this.load(); } }
  next() { if ((this.page + 1) * this.size < this.total) { this.page++; this.load(); } }
}
