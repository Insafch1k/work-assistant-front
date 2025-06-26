import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Resume } from '../models/resume.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://192.168.91.64:8000';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  // Отправка резюме на бэкенд
  createResume(resume: Resume): Observable<Resume> {

    const tgId = this.userService.getTgId();

    const resumeData = {
      job_title: resume.job_title,
      education: resume.education,
      work_xp: resume.work_xp,
      skills: resume.skills,
    };

    console.log('Отправляемые данные резюме:', resumeData);

    return this.http.post<Resume>(`${this.apiUrl}/resumes`, resumeData);
  }

  // Получение резюме с бэкенда
  getResume(timestamp?: number): Observable<Resume | null> {
    // Добавляем параметр для предотвращения кэширования
    const url = timestamp ? 
      `${this.apiUrl}/resumes?_=${timestamp}` : 
      `${this.apiUrl}/resumes`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Ответ от сервера (резюме):', response);
        
        // Проверяем, является ли ответ массивом
        if (Array.isArray(response)) {
          if (response.length > 0) {
            return response[0];
          }
        } 
        // Если это объект с полями резюме
        else if (response && response.job_title) {
          return response;
        }
        
        return null;
      }),
      catchError(error => {
        console.error('Ошибка при получении резюме:', error);
        return of(null); // Возвращаем null в случае ошибки
      })
    );
  }

  updateResume(resumeId: number, resume: Resume): Observable<Resume> {
    const resumeData = {
      job_title: resume.job_title,
      education: resume.education,
      work_xp: resume.work_xp,
      skills: resume.skills
    };
    
    return this.http.put<Resume>(`${this.apiUrl}/resumes/${resumeId}`, resumeData);
  }

}