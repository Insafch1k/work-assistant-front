import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';

// Интерфейсы для модерации
export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'finder' | 'employer';
  status: 'active' | 'banned';
  registration_date: string;
  tg_username?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
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
      catchError(() => of(false)) // В случае ошибки считаем что не админ
    );
  }

  // Получение списка пользователей с пагинацией
  getUsers(params: {
    limit: number;
    offset: number;
    name_filter?: string;
  }): Observable<UsersResponse> {
    let httpParams = new HttpParams()
      .set('limit', params.limit.toString())
      .set('offset', params.offset.toString());
    
    if (params.name_filter) {
      httpParams = httpParams.set('name_filter', params.name_filter);
    }

    return this.http.get<UsersResponse>(`${this.userService.apiUrl}/admin/get_users`, { params: httpParams });
  }

  // Бан пользователя
  banUser(userId: string): Observable<any> {
    return this.http.post(`${this.userService.apiUrl}/admin/ban_user`, { user_id: userId });
  }

  // Разбан пользователя
  unbanUser(userId: string): Observable<any> {
    return this.http.post(`${this.userService.apiUrl}/admin/unban_user`, { user_id: userId });
  }

  // Получение списка вакансий для модерации (используем существующий API)
  getVacanciesForModeration(params: {
    limit: number;
    offset: number;
  }): Observable<VacanciesResponse> {
    let httpParams = new HttpParams()
      .set('limit', params.limit.toString())
      .set('offset', params.offset.toString());

    return this.http.get<VacanciesResponse>(`${this.userService.apiUrl}/vacancies`, { params: httpParams });
  }

  // Удаление вакансии (если есть такой API)
  deleteVacancy(vacancyId: string): Observable<any> {
    return this.http.delete(`${this.userService.apiUrl}/vacancies/${vacancyId}`);
  }
}
