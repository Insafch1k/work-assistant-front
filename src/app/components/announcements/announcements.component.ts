import { Component, OnInit } from '@angular/core';
import { Vacancy } from 'src/app/models/vacancy.model';
import { VacancyService } from 'src/app/services/vacancy.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  announcements: Vacancy[] = [];

  constructor(private vacancyService: VacancyService) { }

  ngOnInit(): void {
    this.announcements = [];
  }
}
