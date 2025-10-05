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
  status?: 'active' | 'banned'; // Добавляем поле статуса
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
    // МОК - всегда возвращаем true для тестирования
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true); // Всегда админ для тестирования
        observer.complete();
      }, 200);
    });

    // РЕАЛЬНЫЙ API (раскомментируй когда сервер будет готов):
    /*
    return this.http.get<{is_admin: boolean}>(`${this.userService.apiUrl}/is_admin`).pipe(
      map(response => response.is_admin),
      catchError(() => of(false)) // В случае ошибки считаем что не админ
    );
    */
  }

  // Получение списка пользователей с пагинацией
  getUsers(params: {
    limit: number;
    offset: number;
    name_filter?: string;
  }): Observable<UsersResponse> {
    // МОК ДАННЫЕ - замени на реальный API когда сервер будет готов
    const mockUsers: User[] = [
      {
        user_id: 1,
        user_name: "Альбина Иванова",
        user_role: "employer",
        tg: "7912651780",
        tg_username: "@albinaworkingstandart",
        phone: "+79934235887",
        rating: "4.8",
        created_at: "2025-09-20T10:30:00Z",
        last_login_at: "2025-09-26T08:37:35Z",
        is_admin: false,
        photo: null,
        status: "active"
      },
      {
        user_id: 2,
        user_name: "Дмитрий Петров",
        user_role: "finder",
        tg: "7912345678",
        tg_username: "@dmitry_finder",
        phone: "+79912345678",
        rating: "4.5",
        created_at: "2025-09-18T14:20:00Z",
        last_login_at: "2025-09-25T16:45:00Z",
        is_admin: false,
        photo: null,
        status: "active"
      },
      {
        user_id: 3,
        user_name: "Мария Сидорова",
        user_role: "employer",
        tg: "7998765432",
        tg_username: "@maria_employer",
        phone: "+79987654321",
        rating: "3.2",
        created_at: "2025-09-15T09:15:00Z",
        last_login_at: "2025-09-24T12:30:00Z",
        is_admin: false,
        photo: null,
        status: "banned"
      },
      {
        user_id: 4,
        user_name: "Алексей Козлов",
        user_role: "finder",
        tg: "7911111111",
        tg_username: "@alex_finder",
        phone: "+79911111111",
        rating: "4.9",
        created_at: "2025-09-10T11:00:00Z",
        last_login_at: "2025-09-26T09:15:00Z",
        is_admin: false,
        photo: null,
        status: "active"
      },
      {
        user_id: 5,
        user_name: "Елена Смирнова",
        user_role: "employer",
        tg: "7922222222",
        tg_username: "@elena_employer",
        phone: "+79922222222",
        rating: "4.7",
        created_at: "2025-09-05T16:45:00Z",
        last_login_at: "2025-09-25T14:20:00Z",
        is_admin: true,
        photo: null,
        status: "active"
      }
    ];

    // Фильтрация по имени если указан поиск
    let filteredUsers = mockUsers;
    if (params.name_filter) {
      filteredUsers = mockUsers.filter(user => 
        user.user_name.toLowerCase().includes(params.name_filter!.toLowerCase())
      );
    }

    // Пагинация
    const startIndex = params.offset;
    const endIndex = startIndex + params.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Имитируем задержку сети
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          data: paginatedUsers
        });
        observer.complete();
      }, 500);
    });

    // РЕАЛЬНЫЙ API (раскомментируй когда сервер будет готов):
    /*
    const body: any = {
      limit: params.limit,
      offset: params.offset,
    };

    if (params.name_filter) {
      body.name_filter = params.name_filter;
    }

    return this.http.post<UsersResponse>(`${this.userService.apiUrl}/admin/get_users`, body);
    */
  }

  // Бан пользователя
  banUser(userId: string): Observable<any> {
    // МОК - имитируем успешный ответ
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: `Пользователь ${userId} забанен` });
        observer.complete();
      }, 300);
    });

    // РЕАЛЬНЫЙ API (раскомментируй когда сервер будет готов):
    // return this.http.post(`${this.userService.apiUrl}/admin/ban_user`, { user_id: userId });
  }

  // Разбан пользователя
  unbanUser(userId: string): Observable<any> {
    // МОК - имитируем успешный ответ
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: `Пользователь ${userId} разбанен` });
        observer.complete();
      }, 300);
    });

    // РЕАЛЬНЫЙ API (раскомментируй когда сервер будет готов):
    // return this.http.post(`${this.userService.apiUrl}/admin/unban_user`, { user_id: userId });
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
