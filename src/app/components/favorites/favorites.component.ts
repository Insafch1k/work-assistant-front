import { Component, OnInit } from '@angular/core';
import { FavoritesService } from 'src/app/services/favorites.service';
import { UserService } from 'src/app/services/user.service';
import { MetricsService } from 'src/app/services/metrics.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private userService: UserService,
    private metricsService: MetricsService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites():void {
    this.isLoading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites.map(vacancy => ({
          ...vacancy,
          isFavorite: vacancy.is_favorite
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке избранного:', err);
        this.error = 'Не удалось загрузить избранное';
        this.isLoading = false;
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