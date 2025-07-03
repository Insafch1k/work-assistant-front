import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Announcement } from 'src/app/models/announcement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  

  constructor(
    private announcementService: AnnouncementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.announcementService.getMyAnnouncements().subscribe({
      next: (announcements) => {
        this.announcements = announcements;
      },
      error: (err) => {
        console.error('Ошибка при загрузке объявлений:', err);
      }
    });
  }

  editAnnouncement(job_id: number) {
    this.router.navigate(['/editing-announcement', job_id]);
  }
}
