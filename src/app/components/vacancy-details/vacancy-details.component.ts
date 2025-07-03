import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VacancyService } from '../../services/vacancy.service';
import { FavoritesService } from '../../services/favorites.service';
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
    private viewHistoryService: ViewHistoryService
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
        this.vacancy = { ...details, job_id:id };
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
    console.log('Метод временно отключен'); // Заглушка
  }
  
  getHoursText(hours: number | string): string {
    if (hours === undefined || hours === null) {
      return 'часов';
    }
    
    // Преобразуем в число, если это строка
    const numHours = typeof hours === 'string' ? parseFloat(hours) : hours;
    
    // Получаем только целую часть для склонения
    const intHours = Math.floor(numHours);
    
    // Последняя цифра и предпоследняя цифра
    const lastDigit = intHours % 10;
    const lastTwoDigits = intHours % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'часов';
    } else if (lastDigit === 1) {
      return 'час';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return 'часа';
    } else {
      return 'часов';
    }
  }
}