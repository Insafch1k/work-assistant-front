import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Announcement } from '../models/announcement.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.apiUrl = this.userService.apiUrl;
  }

  createAnnouncement(announcement: Announcement): Observable<Announcement> {

    const announcementData = {
      title: announcement.title,
      description: announcement.description,
      salary: announcement.salary,
      date: announcement.date,
      time_start: announcement.time_start,
      time_end: announcement.time_end,
      city: announcement.city,
      address: announcement.address,
      is_urgent: announcement.is_urgent,
      car: announcement.car,
      xp: announcement.xp,
      age: announcement.age,
      wanted_job: announcement.wanted_job
    }

    return this.http.post<Announcement>(`${this.apiUrl}/jobs`, announcementData);
  }

  getMyAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/jobs/me`);
  }

  updateAnnouncement(id: string, data: Partial<Announcement>): Observable<Announcement> {
    return this.http.patch<Announcement>(`${this.apiUrl}/jobs/me/${id}`, data);
  }

  deleteAnnouncement(jobId: string) {
    return this.http.delete<any>(`${this.apiUrl}/jobs/me/${jobId}`);
  }

// запрос для показа обьявлений работодателя - соискателю
  getAnnouncementsByEmployer(employerId: string): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/employers/${employerId}`);
  }
}