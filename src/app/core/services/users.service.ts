import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { PageResponse } from '../model/pageResponse';
import { UserCreateRequest } from '../model/userCreateRequest';
import { UserResponse } from '../model/userResponse';
import { UserUpdateRequest } from '../model/userUpdateRequest';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private base = environment.apiBase + environment.endpoints.users;
  constructor(private http: HttpClient) {}

  list(page = 0, size = 10): Observable<PageResponse<UserResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<AppResponse<PageResponse<UserResponse>>>(`${this.base}`, { params })
      .pipe(map(res => res.data));
  }

  create(body: UserCreateRequest): Observable<UserResponse> {
    return this.http.post<AppResponse<UserResponse>>(`${this.base}`, body)
      .pipe(map(res => res.data));
  }

  updateSalary(id: number, salary: number | null): Observable<UserResponse> {
    const body: UserUpdateRequest = { salary };
    return this.http.patch<AppResponse<UserResponse>>(`${this.base}/${id}`, body)
      .pipe(map(res => res.data));
  }

  delete(id: number) {
    return this.http.delete<AppResponse<unknown>>(`${this.base}/${id}`);
  }
}
