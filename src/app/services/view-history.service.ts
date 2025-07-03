import { Injectable } from '@angular/core';
import { Vacancy } from '../models/vacancy.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class ViewHistoryService {
  private apiUrl: string;
  
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
  }

  viewJob(jobId: number): Observable<any> {
    const url = `${this.apiUrl}/jobs/${jobId}/view`;

    return this.http.post(url, {

    })
  }

  getViewHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs/history`);
  }

}