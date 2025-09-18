import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Router } from '@angular/router';
import { Announcement } from 'src/app/models/announcement.model';
import { ActivatedRoute } from '@angular/router';

declare const Dadata: any;

@Component({
  selector: 'app-editing-announcement',
  templateUrl: './editing-announcement.component.html',
  styleUrls: ['./editing-announcement.component.scss']
})
export class EditingAnnouncementComponent implements OnInit {
  job_id!: number;
  form!: FormGroup;
  formError: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.job_id = Number(this.route.snapshot.paramMap.get('job_id'));
    this.announcementService.getMyAnnouncements().subscribe({
      next: (announcements) => {
        const found = announcements.find(a => a.job_id === this.job_id);
        if (found) {
          this.initForm(found);
        } else {
          this.router.navigate(['/app/announcements']);
        }
      },
      error: (err) => {
      }
    });
  }

  initForm(announcement: Announcement) {
    this.form = this.fb.group({
      wanted_job: [announcement.wanted_job, Validators.required],
      title: [announcement.title, Validators.required],
      city: [announcement.city, Validators.required],
      address: [announcement.address, Validators.required],
      time_start: [announcement.time_start, Validators.required],
      time_end: [announcement.time_end, Validators.required],
      date: [announcement.date, Validators.required],
      salary: [announcement.salary, [Validators.required, Validators.pattern(/^\d+$/)]],
      is_urgent: [announcement.is_urgent],
      car: [announcement.car],
      xp: [announcement.xp],
      age: [announcement.age, Validators.required],
      description: [announcement.description, Validators.required]
    });
  }

  ngAfterViewInit() {
    const input = document.getElementById('address');
    if (input && typeof Dadata !== 'undefined') {
      Dadata.createSuggestions(input, {
        token: '441d69731e712ccdc0783034f9e890d8727629df',
        type: 'address',
        onSelect: (suggestion: any) => {
          // Получаем полный адрес из подсказки
          const fullAddress = suggestion.value;
          // Получаем город или населённый пункт
          const city = suggestion.data.city || suggestion.data.settlement || '';
          
          // Заполняем оба поля
          this.form.get('address')?.setValue(fullAddress);
          this.form.get('city')?.setValue(city);
        }
      });
    }
  }

  onSubmit() {
    this.formError = '';
    if (this.form.invalid || this.job_id === undefined) {
      this.formError = 'Заполните все поля';
      return;
    }

    // Валидация даты: запрещаем прошедшие дни; сегодняшнюю дату разрешаем при любом времени
    const dateStr: string = this.form.get('date')?.value;
    if (dateStr && this.isPastCalendarDate(dateStr)) {
      this.formError = 'Вы указали прошедшую дату. Пожалуйста, исправьте.';
      return;
    }
  
    const formValue = this.form.value;
    formValue.salary = Number(formValue.salary);
  
    this.announcementService.updateAnnouncement(String(this.job_id), formValue).subscribe({
      next: (_response: any) => {
        this.router.navigate(['/app/announcements']);
      },
      error: (_err: any) => {
        this.formError = 'Ошибка при сохранении изменений';
      }
    });
  }

  onDelete() {
    if (confirm('Вы уверены, что хотите удалить это объявление?')) {
      this.announcementService.deleteAnnouncement(String(this.job_id)).subscribe({
        next: (response) => {
          console.log('Объявление удалено:', response.message);
          this.router.navigate(['/app/announcements']);
        },
        error: (err) => {
          this.formError = 'Ошибка при удалении объявления';
          console.error('Ошибка при удалении:', err);
        }
      });
    }
  }

  onDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Только цифры
  
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
    this.form.get('date')?.setValue(value, { emitEvent: false });
  }
  
  onTimeInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
  
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
    let value = input.value.replace(/\D/g, '');
    input.value = value;
    this.form.get('salary')?.setValue(value, { emitEvent: false });
  }

  // Helpers
  private isPastCalendarDate(ddmmyyyy: string): boolean {
    const [dd, mm, yyyy] = ddmmyyyy.split('.').map(Number);
    if (!dd || !mm || !yyyy) return false;
    const target = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    return target < todayOnly;
  }
}
