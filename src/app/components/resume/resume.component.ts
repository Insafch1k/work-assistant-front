import { Component, OnInit } from '@angular/core';
import { Resume } from 'src/app/models/resume.model';
import { ResumeService } from 'src/app/services/resume.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  resume: Resume = {
    job_title: '',
    education: '',
    work_xp: '',
    skills: '',
  };
  
  skillsList: string[] = [];
  currentSkill: string = '';
  isLoading: boolean = false;
  
  constructor(
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Проверяем, есть ли уже резюме у пользователя
    this.resumeService.getResume().subscribe({
      next: (existingResume) => {
        if (existingResume) {
          alert('У вас уже есть резюме. Вы можете редактировать его в профиле.');
          this.router.navigate(['/app/profile']);
        }
      },
      error: (error) => {
        console.error('Ошибка при проверке существующего резюме:', error);
        // Продолжаем работу даже при ошибке
      }
    });
  }
  
  // Добавление навыка в список
  addSkill(): void {
    if (this.currentSkill.trim()) {
      this.skillsList.push(this.currentSkill.trim());
      this.currentSkill = '';
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
  }
  
  // Сохранение резюме
  saveResume(): void {
    // Если список навыков непустой, объединяем их в строку
    if (this.skillsList.length > 0) {
      this.resume.skills = this.skillsList.join(',');
    }
    
    // Добавляем проверку на заполненность обязательных полей
    if (!this.resume.job_title || !this.resume.education || !this.resume.work_xp) {
      console.error('Заполните все обязательные поля');
      return;
    }
    
    this.isLoading = true;

    const tgId = this.userService.getTgId();
    const role = this.userService.getUserRole();
    const name = this.userService.getUserName();
    
    // Сначала инициализируем профиль
    this.userService.registerUser(tgId, role, name).subscribe({
      next: () => {
        console.log('Профиль успешно инициализирован');
        // После успешной инициализации создаем резюме
        this.createResumeAfterInit();
      },
      error: (initError) => {
        console.log('Ошибка инициализации профиля:', initError);
        // Если ошибка инициализации из-за того, что пользователь уже существует,
        // все равно пытаемся создать резюме
        if (initError.error && initError.error.error === "Пользователь уже существует") {
          console.log('Пользователь уже существует, создаем резюме');
          this.createResumeAfterInit();
        } else {
          console.error('Неизвестная ошибка инициализации профиля:', initError);
          this.isLoading = false;
          alert('Ошибка при инициализации профиля. Пожалуйста, попробуйте позже.');
        }
      }
    });
  }

  private createResumeAfterInit(): void {
    this.resumeService.createResume(this.resume).subscribe({
      next: (response) => {
        console.log('Резюме успешно сохранено', response);
        this.isLoading = false;
        // Переходим на профиль с параметром, указывающим, что нужно обновить данные
        this.router.navigate(['/app/profile'], { 
          queryParams: { fromResume: 'true', timestamp: new Date().getTime() } 
        });
      },
      error: (error) => {
        console.error('Ошибка при сохранении резюме', error);
        this.isLoading = false;
        alert('Не удалось сохранить резюме. Пожалуйста, попробуйте позже.');
      }
    });
  }
}