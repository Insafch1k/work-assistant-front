import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Vacancy } from '../models/vacancy.model';
import { FavoritesService } from './favorites.service';
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

  // Получение вакансий с бэкенда
fetchVacancies(): Observable<Vacancy[]> {
  return this.http.get<any[]>(`${this.apiUrl}/jobs/finders`)
    .pipe(
      map(response => {
        // Преобразуем данные с бэкенда в формат нашей модели
        const vacancies: Vacancy[] = response.map((item) => ({
            job_id: item.job_id, // Используем job_id с бэкенда
            employer_id: 0,    // Заполняем значениями по умолчанию
            title: item.title || 'Без названия',
            category: 'Не указана',
            description: 'Описание отсутствует',
            salary: item.salary || 0,
            date: new Date().toISOString().split('T')[0], // Текущая дата
            time_start: '09:00',
            time_end: item.time_hours ? `${parseInt(item.time_hours) + 9}:00` : '18:00',
            address: item.address || 'Адрес не указан',
            rating: 0,
            is_urgent: false,
            status: 'open',
            created_at: new Date().toISOString(),
            isFavorite: false
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
}