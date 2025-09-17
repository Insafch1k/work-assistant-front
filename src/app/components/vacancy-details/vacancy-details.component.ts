import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VacancyService } from '../../services/vacancy.service';
import { FavoritesService } from '../../services/favorites.service';
import { UserService } from 'src/app/services/user.service';
import { MetricsService } from 'src/app/services/metrics.service';
import { Vacancy } from '../../models/vacancy.model';
import { ViewHistoryService } from 'src/app/services/view-history.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.scss']
})
export class VacancyDetailsComponent implements OnInit {
  vacancy: any | null = null;
  isLoading = false;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private vacancyService: VacancyService,
    private viewHistoryService: ViewHistoryService,
    private favoritesService: FavoritesService,
    private userService: UserService,
    private metricsService: MetricsService
  ) { }
  
  ngOnInit(): void {
    // Получаем id из параметров маршрута
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.route.queryParams.subscribe(query => {
          const fromHistory = query['fromHistory'];
          this.loadVacancyDetails(+id, fromHistory);
        });
      } else {
        console.error('Неверный идентификатор вакансии');
      }
    });
  }
  
  loadVacancyDetails(id: number, fromHistory:boolean): void {
    this.vacancyService.getVacancyDetails(id).subscribe({
      next: (details) => {
        this.vacancy = { 
          ...details, 
          job_id: id, 
          isFavorite: details.is_favorite 
        };
        if (!fromHistory) {
          this.viewHistoryService.viewJob(id).subscribe();
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке деталей вакансии', err);
      }
    })
  }
  
  toggleFavorite(): void {
    if (!this.vacancy) return;
    if (this.vacancy.isFavorite) {
      this.favoritesService.removeFromFavorites(this.vacancy.job_id).subscribe({
        next: () => {
          this.vacancy.isFavorite = false;
        },
        error: (err) => {
          console.error('Ошибка при удалении из избранного:', err);
        }
      });
    } else {
      this.favoritesService.addToFavorites(this.vacancy.job_id).subscribe({
        next: () => {
          this.vacancy.isFavorite = true;
        },
        error: (err) => {
          console.error('Ошибка при добавлении в избранное:', err);
        }
      });
    }
  }

  callEmployer(vacancy: Vacancy): void {
    if (vacancy.phone) {
      const tgId = this.userService.getTgId();
      if (tgId) {
        this.metricsService.trackVacancySent(tgId);
      }
      window.open(`tel:${vacancy.phone}`, '_blank');
    } else {
      alert('У работодателя не указан номер телефона');
    }
  }

  writeEmployer(vacancy: Vacancy): void {
    if (vacancy.tg_username) {
      const tgId = this.userService.getTgId();
      if (tgId) {
        this.metricsService.trackVacancySent(tgId);
      }
      window.open(`https://t.me/${vacancy.tg_username.replace('@', '')}`, '_blank');
    } else {
      alert('У работодателя не указан Telegram username');
    }
  }
}