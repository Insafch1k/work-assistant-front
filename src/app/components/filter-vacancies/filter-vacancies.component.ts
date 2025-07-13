import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterService } from 'src/app/services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter-vacancies',
  templateUrl: './filter-vacancies.component.html',
  styleUrls: ['./filter-vacancies.component.scss']
})
export class FilterVacanciesComponent implements OnInit {
  form!: FormGroup;
  errorMessage: string = '';
  

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      wanted_job: [''],
      address: [''],
      time_start: [''],
      time_end: [''],
      date: [''],
      time_hours: [''],
      salary: [''],
      is_urgent: [false],
      is_car_required: [false],
      xp: [''],
      age: ['']
    });
  }

  applyFilter() {
    this.errorMessage = '';
  
    const salaryValue = this.form.get('salary')?.value;
    if (salaryValue !== '' && !/^\d+$/.test(salaryValue)) {
      this.errorMessage = 'Поле "Зарплата" должно содержать число';
      return;
    }
  
    const params: any = {};
    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      if (key === 'is_urgent') {
        params[key] = value === true || value === 'true';
      } else if (key === 'salary' && value !== '') {
        params[key] = Number(value);
      } else if (key === 'date' && value) {
        params[key] = value;
      } else if (value !== '' && value !== false) {
        params[key] = value;
      }
    });
  
    if (params.salary && !isNaN(params.salary)) {
      params.salary = Number(params.salary);
    }
  
    this.router.navigate(['/vacancies'], { queryParams: params });
  }

  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Оставляем только цифры
  
    if (value.length > 2) {
      value = value.slice(0, 2) + '.' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '.' + value.slice(5, 9);
    }
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
  
    input.value = value;
    this.form.get('date')?.setValue(value, { emitEvent: false }); // Обновляем FormControl без лишних событий
  }

  onTimeInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Оставляем только цифры
  
    if (value.length > 2) {
      value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
  
    input.value = value;
    this.form.get(controlName)?.setValue(value, { emitEvent: false });
  }

  onSalaryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Оставляем только цифры
    let value = input.value.replace(/\D/g, '');
    input.value = value;
    this.form.get('salary')?.setValue(value, { emitEvent: false });
  }
  
}
