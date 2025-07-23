import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Vacancy } from '../models/vacancy.model';
import { UserService } from './user.service';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class VacancyService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
  }  

  // /** Формирует полный путь к фото */
  // private getPhotoUrl(photo: string | null | undefined): string {
  //   if (!photo) return 'assets/images/user-avatar.png';
  //   if (photo.startsWith('http')) return photo;
  //   // Если apiUrl заканчивается на /api, убираем /api
  //   const base = this.apiUrl.endsWith('/api') ? this.apiUrl.replace('/api', '') : this.apiUrl;
  //   return `${base}${photo}`;
  // }

  private getPhotoUrl(photo: string | null | undefined): string {
    // Всегда возвращаем дефолтную картинку
    return 'assets/images/user-avatar.png';
  }

  // Получение вакансий с бэкенда для соискателей
fetchFinderVacancies (): Observable<Vacancy[]> {
  return this.http.get<any[]>(`${this.apiUrl}/jobs/finders`)
    .pipe(
      map(response => {
        // Преобразуем данные с бэкенда в формат нашей модели
        const vacancies: Vacancy[] = response.map((item) => ({
          address: item.address,
          created_at: item.created_at,
          employer_id: item.employer_id,
          isFavorite: item.is_favorite,
          is_urgent: item.is_urgent,
          job_id: item.job_id,
          photo: this.getPhotoUrl(item.photo),
          rating: item.rating,
          salary: item.salary,
          time_hours: item.time_hours,
          title: item.title,
          phone: item.phone ?? null,
          tg_username: item.tg_username ?? null,
          car: item.car ?? null
        }));

          return vacancies;
      }),
      tap(vacancies => {
        console.log('Получены вакансии с сервера:', vacancies);
      }),
      catchError(error => {
        console.error('Ошибка при загрузке вакансий:', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
}

// Получение вакансий для работодателя
fetchEmployerVacancies(): Observable<Vacancy[]> {
  return this.http.get<any[]>(`${this.apiUrl}/jobs/employers`)
    .pipe(
      map(response => {
        // Преобразуем данные с бэкенда в формат нашей модели
        const vacancies: Vacancy[] = response.map((item) => ({
            address: item.address,
            created_at: item.created_at,
            employer_id: item.employer_id,
            isFavorite: item.is_favorite,
            is_urgent: item.is_urgent,
            job_id: item.job_id,
            photo: this.getPhotoUrl(item.photo),
            rating: item.rating,
            salary: item.salary,
            time_hours: item.time_hours,
            title: item.title,
            phone: item.phone ?? null,
            tg_username: item.tg_username ?? null,
            car: item.car ?? null
          }));

          return vacancies;
      }),
      tap(vacancies => {
        console.log('Получены вакансии работодателя с сервера:', vacancies);
      }),
      catchError(error => {
        console.error('Ошибка при загрузке вакансий работодателя:', error);
        return of([]); // Возвращаем пустой массив в случае ошибки
      })
    );
}

  // Получение деталей вакансии
  getVacancyDetails(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/jobs/${jobId}/seeall`)
      .pipe(
        map(response => {
          console.log('Детали вакансии с сервера:', response);
          
          // Обрабатываем дату, если она в формате ISO
          let formattedDate = response.date;
          if (response.date && response.date.includes('T')) {
            const dateObj = new Date(response.date);
            formattedDate = dateObj.toLocaleDateString('ru-RU'); // Форматируем дату как ДД.ММ.ГГГГ
          }
          
          // Обрабатываем часы, преобразуя их в строку без десятичной части, если она равна 0
          let formattedHours = response.hours;
          if (typeof response.hours === 'number') {
            formattedHours = Number.isInteger(response.hours) ? 
              response.hours.toString() : 
              response.hours.toString();
          }
          
          return {
            ...response,
            date: formattedDate,
            hours: formattedHours
          };
        }),
        tap(response => {
          console.log('Обработанные детали вакансии:', response);
        }),
        catchError(error => {
          console.error('Ошибка при получении деталей вакансии:', error);
          return of(null);
        })
      );
  }

  filterVacancies(params: any): Observable<Vacancy[]> {
    const fixedParams = { ...params };
    if ('is_urgent' in fixedParams) {
      fixedParams.is_urgent = fixedParams.is_urgent === true || fixedParams.is_urgent === 'true';
    }
    return this.http.post<Vacancy[]>(`${this.apiUrl}/jobs/filter`, fixedParams);
  }
  
}