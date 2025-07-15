import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ResumeService } from 'src/app/services/resume.service';
import { Resume } from 'src/app/models/resume.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Announcement } from 'src/app/models/announcement.model';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { TelegramService } from 'src/app/services/telegram.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  editableName: string = '';
  isEditing: boolean = false;
  userResume: Resume | null = null;
  isLoadingResume: boolean = false;
  resumeSkills: string[] = [];
  resumeError: string = '';
  isEmployerProfileView: boolean = false;
  announcements: Announcement[] = [];
  employerProfile: any
  phoneNumber: string = '';
  username: string = '';

  constructor (
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private telegramService: TelegramService
  ) {}

  ngOnInit(): void {
    
    this.phoneNumber = this.telegramService.getUserPhone();
    this.username = this.telegramService.getUserUsername();

    this.route.paramMap.subscribe(params => {
      const employerId = params.get('employer_id');
      this.userRole = this.userService.getUserRole();
  
      if (employerId) {
        // Соискатель смотрит профиль работодателя
        this.isEmployerProfileView = true;
        this.loadEmployerProfile(employerId);
      } else {
        // Пользователь смотрит свой профиль (соискатель или работодатель)
        this.isEmployerProfileView = false;
        this.userName = this.userService.getUserName();
        this.userRole = this.userService.getUserRole();
        if (this.userRole === 'finder') {
          this.loadUserResume();
        }
      }
    });
  }

  loadEmployerProfile(employerId: string) {
    this.userService.getEmployerProfile(employerId).subscribe({
      next: (data) => {
        this.employerProfile = data.profile; 
        this.announcements = data.vacancies; 
        this.userRole = 'employer';
      },
      error: (err) => {

      }
    });
  }

  goToVacancyDetails(jobId: number) {
    this.router.navigate(['/jobs', jobId, 'seeall']);
  }

  loadUserResume(cacheParam?: number): void {
    this.isLoadingResume = true;
    console.log('Загрузка резюме...');
    
    this.resumeService.getResume(cacheParam).subscribe({
      next: (resume) => {
        console.log('Полный ответ от сервера (резюме):', resume);
        
        if (resume) {
          this.userResume = resume;
          console.log('Установлено резюме:', this.userResume);
          
          // Разбиваем навыки на массив для отображения
          if (this.userResume.skills) {
            this.resumeSkills = this.userResume.skills.split(',').map(skill => skill.trim());
            console.log('Навыки:', this.resumeSkills);
          }
        } else {
          console.log('Резюме не найдено в ответе');
          this.userResume = null;
        }
        
        this.isLoadingResume = false;
      },
      error: (error) => {
        if (error.status === 500) {
          console.log('Резюме не найдено (ошибка 500)');
          this.userResume = null;
        } else {
          console.error('Ошибка при загрузке резюме:', error);
          this.resumeError = 'Не удалось загрузить резюме';
        }
        this.isLoadingResume = false;
      }
    });
  }

  editResume(): void {
    this.router.navigate(['/editing-resume']);
  }

  startEditing(): void {
    this.isEditing = true;

    this.editableName = this.userName; 
  }

  saveChanges () {
    if (this.editableName && this.editableName.trim().length >= 2) {
      this.userName = this.editableName.trim();
      this.userService.saveUserName(this.userName);
      this.isEditing = false;
    }
  }

  cancelEditing () {
    this.editableName = this.userName;

    this.isEditing = false;
  }

  getRoleName():string {
    if (this.userRole === 'finder') {
      return 'Соискатель'
    }
    return 'Работодатель';
  }
}
