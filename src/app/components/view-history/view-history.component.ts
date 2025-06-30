import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vacancy } from '../../models/vacancy.model';
import { ViewHistoryService } from '../../services/view-history.service';
import { VacancyService } from '../../services/vacancy.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent {
  viewedVacancies: Vacancy[] = [];
  private subscription = new Subscription();

  constructor(
    private viewHistoryService: ViewHistoryService,
    private vacancyService: VacancyService,
    private favoritesService: FavoritesService
  ) { }

  
}