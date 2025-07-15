import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewHistoryService } from '../../services/view-history.service';
import { FavoritesService } from '../../services/favorites.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit{
  viewHistory: any[] = [];

  constructor(
    private viewHistoryService: ViewHistoryService,
    private favoritesService: FavoritesService,
    private userService: UserService
    
  ) { }

  ngOnInit(): void {
    this.viewHistoryService.getViewHistory().subscribe({
      next: (history) => {
        this.viewHistory = history.map(vacancy => ({
          ...vacancy,
          isFavorite: vacancy.is_favorite
        }));
      },
      error: (err) => {
        console.error('Ошибка при получении истории просмотров:', err);
      }
    });
  }

  toggleFavorite(vacancy: any): void {
    if (vacancy.isFavorite) {
      this.favoritesService.removeFromFavorites(vacancy.job_id).subscribe({
        next: () => {
          vacancy.isFavorite = false;
        },
        error: (err) => {
          console.error('Ошибка при удалении из избранного:', err);
        }
      });
    } else {
      this.favoritesService.addToFavorites(vacancy.job_id).subscribe({
        next: () => {
          vacancy.isFavorite = true;
        },
        error: (err) => {
          console.error('Ошибка при добавлении в избранное:', err);
        }
      });
    }
  }

  isEmployer(): boolean {
    return this.userService.getUserRole() === 'employer';
  }
}