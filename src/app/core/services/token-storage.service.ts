import { Injectable } from '@angular/core';

const TOKEN_KEY = 'accessToken';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  set(token: string) { localStorage.setItem(TOKEN_KEY, token); }
  get(): string | null { return localStorage.getItem(TOKEN_KEY); }
  clear() { localStorage.removeItem(TOKEN_KEY); }
  isLoggedIn(): boolean { return !!this.get(); }
}
