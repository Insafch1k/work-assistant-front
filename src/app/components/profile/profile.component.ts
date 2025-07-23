import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ResumeService } from 'src/app/services/resume.service';
import { Resume } from 'src/app/models/resume.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Announcement } from 'src/app/models/announcement.model';
import { AnnouncementService } from 'src/app/services/announcement.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  photo: string = '';
  phoneNumber: string = '';
  username: string = '';
  rating: string = '';
  reviewCount: number = 0;
  isEmployerProfileView: boolean = false;
  employerProfile: any;
  announcements: Announcement[] = [];

  // Для finder
  userResume: Resume | null = null;
  isLoadingResume: boolean = false;
  resumeSkills: string[] = [];

  // Для редактирования телефона
  isEditingPhone: boolean = false;
  editablePhone: string = '';
  phoneError: string = '';

  constructor(
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
    this.route.paramMap.subscribe(params => {
      const employerId = params.get('employer_id');
      if (employerId) {
        this.isEmployerProfileView = true;
        this.loadEmployerProfile(employerId);
      } else {
        this.isEmployerProfileView = false;
        if (this.userRole === 'employer') {
          this.loadEmployerProfileCached();
        } else if (this.userRole === 'finder') {
          this.loadFinderPhotoCached();
          this.userName = this.userService.getUserName();
          this.loadUserResume();
        }
      }
    });
  }

  // --- Кэш для работодателя ---
  loadEmployerProfileCached() {
    const cached = this.userService.getCachedProfile();
    if (cached) {
      this.setEmployerProfileFields(cached);
    } else {
      this.userService.getMyProfile().subscribe({
        next: (profile) => {
          this.userService.cacheProfile(profile);
          this.setEmployerProfileFields(profile);
        },
        error: () => {}
      });
    }
  }

  setEmployerProfileFields(profile: any) {
    this.userName = profile.user_name;
    this.phoneNumber = profile.phone;
    this.username = profile.tg_username;
    this.userRole = profile.user_role;
    this.photo = profile.photo || 'assets/images/user-avatar.png';
    this.rating = profile.rating;
    this.reviewCount = profile.review_count;
  }

  // --- Кэш для finder (только фото) ---
  loadFinderPhotoCached() {
    const cachedPhoto = this.userService.getCachedProfilePhoto();
    if (cachedPhoto) {
      this.photo = cachedPhoto;
    } else {
      this.userService.getMyProfile().subscribe({
        next: (profile) => {
          const photo = profile.photo || 'assets/images/user-avatar.png';
          this.userService.cacheProfilePhoto(photo);
          this.photo = photo;
        },
        error: () => {
          this.photo = 'assets/images/user-avatar.png';
        }
      });
    }
  }

  // --- Для просмотра профиля работодателя соискателем ---
  loadEmployerProfile(employerId: string) {
    this.userService.getEmployerProfile(employerId).subscribe({
      next: (data) => {
        this.employerProfile = data.profile;
        this.announcements = data.vacancies;
        this.userRole = 'employer';
      },
      error: () => {}
    });
  }

  // --- Для finder: резюме ---
  loadUserResume(): void {
    this.isLoadingResume = true;
    this.resumeService.getResume().subscribe({
      next: (resume) => {
        this.userResume = resume;
        if (resume && resume.skills) {
          this.resumeSkills = resume.skills.split(',').map(skill => skill.trim());
        }
        this.isLoadingResume = false;
      },
      error: () => {
        this.userResume = null;
        this.isLoadingResume = false;
      }
    });
  }

  // --- Телефон ---
  startEditingPhone() {
    this.isEditingPhone = true;
    this.editablePhone = this.phoneNumber && this.phoneNumber !== 'Не указан' ? this.phoneNumber : '+7';
  }

  onPhoneInput(event: any) {
    let value = event.target.value;
    if (value.startsWith('+7')) {
      let digits = value.slice(2).replace(/\D/g, '').slice(0, 10);
      this.editablePhone = '+7' + digits;
    } else {
      let digits = value.replace(/\D/g, '').slice(0, 10);
      this.editablePhone = '+7' + digits;
    }
  }

  onPhoneKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if ((input.selectionStart ?? 0) <= 2 &&
      (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      return;
    }
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

  savePhone() {
    if (this.editablePhone.length !== 12) {
      alert('Введите 10 цифр после +7');
      return;
    }
    this.userService.updateEmployerPhone(this.editablePhone).subscribe({
      next: () => {
        this.phoneNumber = this.editablePhone;
        this.isEditingPhone = false;
        // Обновим кэш профиля
        this.userService.getMyProfile().subscribe({
          next: (profile) => this.userService.cacheProfile(profile)
        });
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

  // --- Прочее ---
  logout() {
    localStorage.clear();
    this.userService.clearProfileCache();
    this.router.navigate(['/authorization']);
  }

  // getPhotoSrc(): string {
  //   if (!this.photo) return 'assets/images/user-avatar.png';
  //   if (this.photo.startsWith('http')) return this.photo;
  //   return `${this.userService.apiUrl}${this.photo}`;
  // }

  getPhotoSrc(): string {
    // Всегда возвращаем дефолтную картинку
    return 'assets/images/user-avatar.png';
  }

  getRoleName(): string {
    if (this.userRole === 'finder') return 'Соискатель';
    return 'Работодатель';
  }

  goToVacancyDetails(jobId: number) {
    this.router.navigate(['/jobs', jobId, 'seeall']);
  }

  editResume(): void {
    this.router.navigate(['/editing-resume']);
  }
}