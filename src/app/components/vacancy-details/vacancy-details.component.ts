import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VacancyService } from '../../services/vacancy.service';
import { FavoritesService } from '../../services/favorites.service';
import { Vacancy } from '../../models/vacancy.model';

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
  ) { }
  
  ngOnInit(): void {
    // Получаем id из параметров маршрута
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.loadVacancyDetails(+id);
      } else {
        console.error('Неверный идентификатор вакансии');
      }
    });
  }
  
  loadVacancyDetails(id: number): void {
    if (!id || isNaN(id)) {
      console.error('Неверный идентификатор вакансии');
      return;
    }

    this.vacancyService.getVacancyDetails(id).subscribe({
      next: (details) => {
        if (!details) {
          console.error('Не удалось получить данные о вакансии');
          return;
        }
        
        this.vacancy = {
          ...details,
          isFavorite: false,
          job_id: id
        };
        
        // Добавляем вакансию в историю просмотра
        // if (this.vacancy && this.vacancy.title) {
        //   this.viewHistoryService.addToHistory({
        //     job_id: id,
        //     title: this.vacancy.title,
        //     employer_id: 0,
        //     category: '',
        //     description: '',
        //     salary: this.vacancy.salary || 0,
        //     date: this.vacancy.date || '',
        //     time_start: '',
        //     time_end: '',
        //     address: this.vacancy.address || '',
        //     rating: 0,
        //     is_urgent: this.vacancy.is_urgent || false,
        //     status: 'open',
        //     created_at: '',
        //     isFavorite: this.vacancy.isFavorite
        //   });
        // }
      },
      error: (err) => {
        console.error('Ошибка при загрузке деталей вакансии:', err);
      }
    });
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