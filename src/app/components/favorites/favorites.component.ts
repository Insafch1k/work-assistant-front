import { Component, OnInit } from '@angular/core';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyService } from '../../services/vacancy.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteVacancies: Vacancy[] = []; // Пустой массив для визуала

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    this.favoriteVacancies = [];
  }

  removeFromFavorites(vacancy: Vacancy): void {
    console.log('Метод временно отключен'); // Заглушка
  }

  toggleFavorite(vacancy: any): void {
    console.log('Метод временно отключен'); // Заглушка
  }
}