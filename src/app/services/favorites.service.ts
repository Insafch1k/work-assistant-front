import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
  }

  addToFavorites(jobId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs/${jobId}/add_favorite`, {
      job_id: jobId
    });
  }

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jobs/get_favorite`);
  }

  removeFromFavorites(jobId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${jobId}/remove_favorite`);
  }
}