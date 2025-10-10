import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewHistoryService } from '../../services/view-history.service';
import { FavoritesService } from '../../services/favorites.service';
import { MetricsService } from 'src/app/services/metrics.service';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private metricsService: MetricsService,
    private subscriptionService: SubscriptionService,
    private router: Router
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

  // отключили проверку подписки при отклике на вакансию
  // callEmployer(vacancy: any): void {
  //   this.subscriptionService.checkSubscriptionAndExecute(
  //     vacancy.job_id,
  //     () => {
  //       if (vacancy.phone) {
  //         const tgId = this.userService.getTgId();
  //         if (tgId) {
  //           this.metricsService.trackVacancySent(tgId);
  //         }
  //         window.open(`tel:${vacancy.phone}`, '_blank');
  //       } else {
  //         alert('У работодателя не указан номер телефона');
  //       }
  //     },
  //   );
  // }

  callEmployer(vacancy: any): void {
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
  
  // отключили проверку подписки при отправке сообщения работодателю
  // writeEmployer(vacancy: any): void {
  //   this.subscriptionService.checkSubscriptionAndExecute(
  //     vacancy.job_id,
  //     () => {
  //       if (vacancy.tg_username) {
  //         const tgId = this.userService.getTgId();
  //         if (tgId) {
  //           this.metricsService.trackVacancySent(tgId);
  //         }
  //         window.open(`https://t.me/${vacancy.tg_username.replace('@', '')}`, '_blank');
  //       } else {
  //         alert('У работодателя не указан Telegram username');
  //       }
  //     },
  //   );
  // }

  writeEmployer(vacancy: any): void {
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
  

  // отключили проверку подписки при просмотре деталей вакансии
  // viewDetails(vacancy: any): void {
  //   this.subscriptionService.checkSubscriptionAndNavigate(
  //     vacancy.job_id,
  //     ['/app/jobs', vacancy.job_id.toString(), 'seeall'],
  //   );
  // }
  
  viewDetails(vacancy: any): void {
    this.router.navigate(['/app/jobs', vacancy.job_id.toString(), 'seeall']);
  }
  
}