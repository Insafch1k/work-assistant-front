import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from 'src/app/services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter-vacancies',
  templateUrl: './filter-vacancies.component.html',
  styleUrls: ['./filter-vacancies.component.scss']
})
export class FilterVacanciesComponent implements OnInit {
  form!: FormGroup;

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
      salary: [''],
      is_urgent: [false],
      xp: [''],
      age: ['']
    });
  }

  toggleUrgent(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.form.get('is_urgent')?.setValue(checkbox.checked);
  }

  applyFilter() {
    const params: any = {};
    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      if (value !== '' && value !== false) params[key] = value;
    });
  
    this.router.navigate(['/vacancies'], { queryParams: params });
  }
}
