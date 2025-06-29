import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-vacancies',
  templateUrl: './filter-vacancies.component.html',
  styleUrls: ['./filter-vacancies.component.scss']
})
export class FilterVacanciesComponent {
  isUrgent: boolean = false;
  
  toggleUrgent(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isUrgent = checkbox.checked;
    console.log('isUrgent:', this.isUrgent); // Для отладки
  }
}
