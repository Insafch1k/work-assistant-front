import { Component, OnInit } from '@angular/core';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyService } from '../../services/vacancy.service';
import { UserService } from 'src/app/services/user.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  vacancies: Vacancy[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(
    private vacancyService: VacancyService,
    private userService: UserService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute
    
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.isLoading = true;
        this.error = null;
        this.vacancyService.filterVacancies(params).subscribe({
          next: (vacancies) => {
            this.vacancies = vacancies;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.';
            this.isLoading = false;
          }
        });
      } else {
        this.loadVacancies();
      }
    });
  }

  loadVacancies(): void {
    this.isLoading = true;
    this.error = null;
    if (this.isEmployer()) {
      this.vacancyService.fetchEmployerVacancies().subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.';
          this.isLoading = false;
        }
      });
    } else {
      this.vacancyService.fetchFinderVacancies().subscribe({
        next: (vacancies) => {
          this.vacancies = vacancies;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.';
          this.isLoading = false;
        }
      });
    }
  }

  isEmployer(): boolean {
    return this.userService.getUserRole() === 'employer';
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

  callEmployer(vacancy: Vacancy): void {
    if (vacancy.phone) {
      window.open(`tel:${vacancy.phone}`, '_blank');
    } else {
      alert('У работодателя не указан номер телефона');
    }
  }

  writeEmployer(vacancy: Vacancy): void {
    if (vacancy.tg_username) {
      window.open(`https://t.me/${vacancy.tg_username.replace('@', '')}`, '_blank');
    } else {
      alert('У работодателя не указан Telegram username');
    }
  }
}