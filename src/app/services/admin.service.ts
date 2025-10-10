import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';

// Интерфейсы для модерации
export interface User {
  user_id: number;
  user_name: string;
  user_role: 'finder' | 'employer';
  tg: string;
  tg_username?: string;
  phone?: string;
  rating: string;
  created_at: string;
  last_login_at: string;
  is_admin: boolean;
  photo?: string | null;
  // status?: 'active' | 'banned';
}

export interface UsersResponse {
  data: User[];
}

export interface Vacancy {
  id: string;
  title: string;
  employer: string;
  city: string;
  date: string;
  status: 'active' | 'pending' | 'rejected';
  description: string;
}

export interface VacanciesResponse {
  vacancies: Vacancy[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  // Проверка прав админа через API
  isAdmin(): Observable<boolean> {

    return this.http.get<{is_admin: boolean}>(`${this.userService.apiUrl}/is_admin`).pipe(
      map(response => response.is_admin),
      catchError(() => of(false)) 
    );
  }


  // Получение списка пользователей с пагинацией
  getUsers(params: {
    limit: number;
    offset: number;
    name_filter?: string;
  }): Observable<UsersResponse> {

    const body: any = {
      limit: params.limit,
      offset: params.offset,
    };

    if (params.name_filter) {
      body.name_filter = params.name_filter;
    }

    return this.http.post<UsersResponse>(`${this.userService.apiUrl}/admin/get_users`, body);
  }

  // Бан пользователя - пока закомментируем
  /*
  banUser(userId: string): Observable<any> {
    return this.http.post(`${this.userService.apiUrl}/admin/ban_user`, { user_id: userId });
  }
  */

  // Разбан пользователя - пока закомментируем
  /*
  unbanUser(userId: string): Observable<any> {
    return this.http.post(`${this.userService.apiUrl}/admin/unban_user`, { user_id: userId });
  }
  */
}
