import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-announcement',
  templateUrl: './new-announcement.component.html',
  styleUrls: ['./new-announcement.component.scss']
})
export class NewAnnouncementComponent {
  form: FormGroup;
  formError: string = '';

  constructor(
    private fb: FormBuilder, 
    private announcementService: AnnouncementService,
    private router: Router
  ) {
    this.form = this.fb.group({
      wanted_job: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      date: ['', Validators.required],
      time_start: ['', Validators.required],
      time_end: ['', Validators.required],
      address: ['', Validators.required],
      is_urgent: [false],
      car: [false],
      xp: [''],
      age: ['', Validators.required]
    });
  }

  onSubmit() {
    this.formError = '';
    if (this.form.invalid) {
      this.formError = 'Заполните все поля';
      return;
    }
  
    const formValue = this.form.value;
    const announcementData = {
      ...formValue,
      salary: Number(formValue.salary),
    };
  
    this.announcementService.createAnnouncement(announcementData).subscribe({
      next: (response) => {
        this.router.navigate(['/announcements']);
      },
      error: (err) => {
        this.formError = 'Ошибка при отправке объявления';
        console.error('Ошибка при создании:', err);
      }
    });
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
}
