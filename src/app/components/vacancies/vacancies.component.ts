import { Component, OnInit } from '@angular/core';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyService } from '../../services/vacancy.service';
import { UserService } from 'src/app/services/user.service';
import { FavoritesService } from 'src/app/services/favorites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetricsService } from 'src/app/services/metrics.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  vacancies: Vacancy[] = [];
  isLoading = false;
  error: string | null = null;
  cities: string[] = [];
  selectedCity: string = '';
  showCityDropdown: boolean = false;
  citySearchText: string = '';
  filteredCities: string[] = [];
  hasActiveFilters: boolean = false;
  
  constructor(
    private vacancyService: VacancyService,
    private userService: UserService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router,
    private metricsService: MetricsService,
    private subscriptionService: SubscriptionService
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Проверяем есть ли активные фильтры (больше одного параметра или есть параметры кроме city)
      this.hasActiveFilters = Object.keys(params).length > 1 || 
                             (Object.keys(params).length === 1 && !params['city']);
      
      // Устанавливаем выбранный город только если это единственный параметр city
      if (params['city'] && Object.keys(params).length === 1) {
        this.selectedCity = params['city'];
      } else {
        this.selectedCity = '';
      }
      
      if (Object.keys(params).length > 0) {
        this.isLoading = true;
        this.error = null;
        this.vacancyService.filterVacancies(params).subscribe({
          next: (vacancies) => {
            this.vacancies = vacancies;
            this.extractCities();
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
          this.extractCities();
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
          this.extractCities();
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

  // отключили проверку подписки при отклике на вакансию
  // callEmployer(vacancy: Vacancy): void {
  //   this.subscriptionService.checkSubscriptionAndExecute(
  //     vacancy.job_id,
  //     () => {
  //       if (vacancy.phone) {
  //         // Отправляем событие отклика на вакансию
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

  callEmployer(vacancy: Vacancy): void {
    if (vacancy.phone) {
      // Отправляем событие отклика на вакансию
      const tgId = this.userService.getTgId();
      if (tgId) {
        this.metricsService.trackVacancySent(tgId);
      }
      
      window.open(`tel:${vacancy.phone}`, '_blank');
    } else {
      alert('У работодателя не указан номер телефона');
    }
  }

  // отключили проверку подпишки при отправке сообщения работодателю
  // writeEmployer(vacancy: Vacancy): void {
  //   this.subscriptionService.checkSubscriptionAndExecute(
  //     vacancy.job_id,
  //     () => {
  //       if (vacancy.tg_username) {
  //         // Отправляем событие отклика на вакансию
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

  writeEmployer(vacancy: Vacancy): void {
    if (vacancy.tg_username) {
      // Отправляем событие отклика на вакансию
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
  // viewDetails(vacancy: Vacancy): void {
  //   this.subscriptionService.checkSubscriptionAndNavigate(
  //     vacancy.job_id,
  //     ['/app/jobs', vacancy.job_id.toString(), 'seeall'],
  //   );
  // }

  viewDetails(vacancy: Vacancy): void {
    this.router.navigate(['/app/jobs', vacancy.job_id.toString(), 'seeall']);
  }

  extractCities(): void {
    // Извлекаем уникальные города из вакансий
    const citySet = new Set<string>();
    this.vacancies.forEach(vacancy => {
      if (vacancy.city) {
        citySet.add(vacancy.city);
      }
    });
    this.cities = Array.from(citySet).sort();
    this.filteredCities = [...this.cities];
    console.log('Извлеченные города:', this.cities);
  }

  toggleCityDropdown(): void {
    if (this.showCityDropdown) {
      return;
    } else {
      this.showCityDropdown = true;
      this.filteredCities = this.citySearchText ? 
        this.cities.filter(city => city.toLowerCase().startsWith(this.citySearchText.toLowerCase())) : 
        [...this.cities];
    }
  }

  onCitySearchChange(event: any): void {
    const searchText = event.target.value.toLowerCase();
    this.citySearchText = searchText;
    
    if (searchText) {
      this.filteredCities = this.cities.filter(city => 
        city.toLowerCase().startsWith(searchText)
      );
    } else {
      this.filteredCities = [...this.cities];
    }
  }

  selectCity(city: string): void {
    this.selectedCity = city;
    this.citySearchText = '';
    this.filteredCities = [...this.cities];
    this.closeCityDropdown();
    
    // Добавляем параметр города в URL
    this.router.navigate(['/app/vacancies'], { 
      queryParams: { city: city },
      queryParamsHandling: 'merge' // Сохраняем другие параметры
    });
  }

  clearCityFilter(): void {
    this.selectedCity = '';
    this.citySearchText = '';
    this.filteredCities = [...this.cities];
    this.closeCityDropdown();
    
    // Убираем параметр города из URL
    this.router.navigate(['/app/vacancies'], { 
      queryParams: { city: null },
      queryParamsHandling: 'merge'
    });
  }

  // Добавим метод для закрытия списка
  closeCityDropdown(): void {
    this.showCityDropdown = false;
    // НЕ очищаем citySearchText, чтобы сохранить введенный текст
  }

}