import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment';
import { LoginRequest } from '../model/loginRequest';
import { AppResponse } from '../model/appResponse';
import { AuthResponse } from '../model/authResponse';
import { RegisterRequest } from '../model/RegisterRequest';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase + environment.endpoints.auth;
  constructor(private http: HttpClient) {}

  login(body: LoginRequest) {
    return this.http.post<AppResponse<AuthResponse>>(`${this.base}/login`, body)
      .pipe(map(res => res.data));
  }

  register(body: RegisterRequest) {
    return this.http.post<AppResponse<unknown>>(`${this.base}/register`, body);
  }
}
