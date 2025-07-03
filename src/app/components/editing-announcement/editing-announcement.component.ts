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
  isUrgent: boolean = false;

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
    this.isUrgent = !!announcement.is_urgent;
    this.form = this.fb.group({
      wanted_job: [announcement.wanted_job, Validators.required],
      title: [announcement.title, Validators.required],
      address: [announcement.address, Validators.required],
      time_start: [announcement.time_start, Validators.required],
      time_end: [announcement.time_end, Validators.required],
      date: [announcement.date, Validators.required],
      salary: [announcement.salary, [Validators.required, Validators.pattern(/^\d+$/)]],
      is_urgent: [this.isUrgent],
      xp: [announcement.xp],
      age: [announcement.age, Validators.required],
      description: [announcement.description, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid && this.job_id !== undefined) {
      const formValue = this.form.value;
      formValue.salary = Number(formValue.salary);
      this.announcementService.updateAnnouncement(String(this.job_id), formValue).subscribe({
        next: (_response: any) => {
          this.router.navigate(['/announcements']);
        },
        error: (_err: any) => {
        }
      });
    }
  }

  toggleUrgent(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isUrgent = checkbox.checked;
    this.form.get('is_urgent')?.setValue(this.isUrgent);
  }
}
