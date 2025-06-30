import { Component, OnInit } from '@angular/core';
import { Vacancy } from '../../models/vacancy.model';
import { VacancyService } from '../../services/vacancy.service';
import { UserService } from 'src/app/services/user.service';

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
  ) {}
  
  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.isLoading = true;
    this.error = null;
    this.vacancyService.fetchVacancies().subscribe({
      next: (vacancies) => {
        this.vacancies = vacancies;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка при загрузке вакансий:', err);
        this.error = 'Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.';
        this.isLoading = false;
      }
    });
  }

  isEmployer(): boolean {
    return this.userService.getUserRole() === 'employer';
  }

}