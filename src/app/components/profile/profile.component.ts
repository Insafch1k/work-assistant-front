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
  isEditingPhone: boolean = false;
  editablePhone: string = '';
  phoneError: string = '';
  photo: string = '';
  rating: string = '';
  reviewCount: number = 0;

  constructor (
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private telegramService: TelegramService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
  
    this.route.paramMap.subscribe(params => {
      const employerId = params.get('employer_id');
  
      if (employerId) {
        // Соискатель смотрит профиль работодателя
        this.isEmployerProfileView = true;
        this.loadEmployerProfile(employerId);
      } else {
        // Пользователь смотрит свой профиль
        this.isEmployerProfileView = false;
        if (this.userRole === 'employer') {
          this.loadMyProfile(); // только для работодателя
        } else if (this.userRole === 'finder') {
          this.userName = this.userService.getUserName();
          this.loadUserResume();
        }
      }
    });
  }

// для профиля работодателя
  loadMyProfile() {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.userName = profile.user_name;
        this.phoneNumber = profile.phone;
        this.username = profile.tg_username;
        this.userRole = profile.user_role;
        this.photo = profile.photo || 'assets/images/user-avatar.png'; 
        this.rating = profile.rating;
        this.reviewCount = profile.review_count;
      },
      error: (err) => {
        console.error('Ошибка загрузки профиля:', err);
      }
    });
  }

// для профиля работодателя который видит соискатель
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

  startEditingPhone() {
    this.isEditingPhone = true;
    // Если номер не указан или пустой — подставляем +7
    this.editablePhone = this.phoneNumber && this.phoneNumber !== 'Не указан' ? this.phoneNumber : '+7';
  }
  
  onPhoneInput(event: any) {
    let value = event.target.value;
  
    // Удаляем всё, кроме цифр, после +7
    if (value.startsWith('+7')) {
      // Оставляем только цифры после +7
      let digits = value.slice(2).replace(/\D/g, '').slice(0, 10);
      this.editablePhone = '+7' + digits;
    } else {
      // Если пользователь удалил +7, возвращаем +7 и только цифры
      let digits = value.replace(/\D/g, '').slice(0, 10);
      this.editablePhone = '+7' + digits;
    }
  }

  onPhoneKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    // Запретить удалять +7
    if (
      (input.selectionStart ?? 0) <= 2 &&
      (event.key === 'Backspace' || event.key === 'Delete')
    ) {
      event.preventDefault();
      return;
    }
    // Разрешить только цифры, Backspace, Delete, стрелки
    if (
      !/[0-9]/.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault();
    }
  }
  
  validatePhone() {
    const phonePattern = /^\+7\d{10}$/;
    if (!phonePattern.test(this.editablePhone)) {
      this.phoneError = 'Введите номер в формате +7XXXXXXXXXX';
    } else {
      this.phoneError = '';
    }
  }
  
  savePhone() {
    if (this.editablePhone.length !== 12) {
      alert('Введите 10 цифр после +7');
      return;
    }
    this.userService.updateEmployerPhone(this.editablePhone).subscribe({
      next: () => {
        if (this.userRole === 'employer') {
          this.loadMyProfile(); // обновляем только для работодателя
        }
        this.isEditingPhone = false;
      },
      error: () => {
        alert('Не удалось обновить номер телефона');
      }
    });
  }

  cancelEditingPhone() {
    this.isEditingPhone = false;
    this.editablePhone = this.phoneNumber;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/authorization']);
  }
}
