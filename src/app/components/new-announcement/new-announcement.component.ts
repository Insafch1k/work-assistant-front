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
  isUrgent: boolean = false;
  form: FormGroup;

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
      xp: [''],
      age: ['', Validators.required]
    });
  }
  
  toggleUrgent(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isUrgent = checkbox.checked;
    console.log('isUrgent:', this.isUrgent);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const announcementData = {
        ...formValue,
        salary: Number(formValue.salary),
        // остальные поля как есть
      };
      console.log('Отправляемые данные:', announcementData);
      this.announcementService.createAnnouncement(announcementData).subscribe({
        next: (response) => {
          console.log('Успешно отправлено!', response);
          this.router.navigate(['/announcements']);
        },
        error: (err) => {
          console.error('Ошибка при отправке:', err);
        }
      });
    }
  }
}
