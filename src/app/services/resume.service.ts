import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Resume } from '../models/resume.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
  }

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

  // получение резюме
  getResume(timestamp?: number): Observable<Resume | null> {

    const url = `${this.apiUrl}/resumes`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('Ответ от сервера (резюме):', response);
        

        if (response && response.job_title) {
          return response;
        }
        
        return null;
      }),
      catchError(error => {
        console.error('Ошибка при получении резюме:', error);
        return of(null); 
      })
    );
  }

    updateResume(resume: Resume): Observable<Resume> {
    const resumeData = {
      job_title: resume.job_title,
      education: resume.education,
      work_xp: resume.work_xp,
      skills: resume.skills
    };
    
    return this.http.patch<Resume>(`${this.apiUrl}/resumes/me`, resumeData);
  }

  deleteResume(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/resumes`);
  }

}