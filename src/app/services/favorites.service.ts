// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { UserService } from './user.service';
// import { map, catchError, of } from 'rxjs';
// import { Vacancy } from '../models/vacancy.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class FavoritesService {
//   constructor(
//     private http: HttpClient,
//     private userService: UserService
//   ) {}

//   toggleFavorite(vacancy: Vacancy): Observable<boolean> {
//     return this.http.post<boolean>(`${this.userService.apiUrl}/favorites/toggle`, { 
//       job_id: vacancy.job_id 
//     }).pipe(
//       map(response => {
//         // Возвращаем новый статус избранного
//         return response.isFavorite;
//       }),
//       catchError(error => {
//         console.error('Ошибка при переключении избранного:', error);
//         // Возвращаем текущий статус в случае ошибки
//         return of(vacancy.isFavorite);
//       })
//     );
//   }
  
// }

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  toggleFavorite(vacancy: any): void {
    console.log('Метод избранного временно отключен');
  }
}