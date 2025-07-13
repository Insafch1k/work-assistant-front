import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Router } from '@angular/router';
import { Announcement } from 'src/app/models/announcement.model';
import { ActivatedRoute } from '@angular/router';

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
          this.router.navigate(['/announcements']);
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

  onSubmit() {
    this.formError = '';
    if (this.form.invalid || this.job_id === undefined) {
      this.formError = 'Заполните все поля';
      return;
    }
  
    const formValue = this.form.value;
    formValue.salary = Number(formValue.salary);
  
    this.announcementService.updateAnnouncement(String(this.job_id), formValue).subscribe({
      next: (_response: any) => {
        this.router.navigate(['/announcements']);
      },
      error: (_err: any) => {
        this.formError = 'Ошибка при сохранении изменений';
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
