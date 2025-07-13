import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vacancy } from '../models/vacancy.model';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
   }

   filterVacancies(params: any): Observable<Vacancy[]> {
    // Копируем объект, чтобы не мутировать исходные params
    const fixedParams = { ...params };
  
    // Преобразуем is_urgent к boolean
    if ('is_urgent' in fixedParams) {
      fixedParams.is_urgent = fixedParams.is_urgent === true || fixedParams.is_urgent === 'true';
    }
  
    return this.http.post<Vacancy[]>(`${this.apiUrl}/jobs/filter`, fixedParams);
  }
}
