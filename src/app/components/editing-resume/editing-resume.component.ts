import { Component, OnInit } from '@angular/core';
import { Resume } from 'src/app/models/resume.model';
import { ResumeService } from 'src/app/services/resume.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editing-resume',
  templateUrl: './editing-resume.component.html',
  styleUrls: ['./editing-resume.component.scss']
})
export class EditingResumeComponent implements OnInit {
  resume: Resume = {
    job_title: '',
    education: '',
    work_xp: '',
    skills: '',
  };

  skillsList: string[] = [];
  currentSkill: string = '';
  isLoading: boolean = false;

  constructor (
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Загрузка существующего резюме
    this.resumeService.getResume().subscribe({
      next: (existingResume) => {
        if (existingResume) {
          this.resume = existingResume;
          // Разделяем навыки на массив
          this.skillsList = this.resume.skills ? this.resume.skills.split(',') : [];
        } else {
          // Если резюме нет, перенаправляем на создание
          this.router.navigate(['/app/resume']);
        }
      },
      error: (error) => {
        console.error('Ошибка при загрузке резюме:', error);
        alert('Не удалось загрузить резюме');
      }
    });
  }

  addSkill(): void {
    if (this.currentSkill.trim()) {
      this.skillsList.push(this.currentSkill.trim());
      this.currentSkill = '';
    }
  }

  removeSkill(index: number): void {
    this.skillsList.splice(index, 1);
  }

    // Обновление резюме
    saveResume(): void {
      // Объединяем навыки в строку
      this.resume.skills = this.skillsList.join(',');
      
      // Проверка обязательных полей
      if (!this.resume.job_title || !this.resume.education || !this.resume.work_xp) {
        alert('Заполните все обязательные поля');
        return;
      }
      
      this.isLoading = true;
      
      // Вызываем метод обновления резюме
      this.resumeService.updateResume(this.resume).subscribe({
        next: (response) => {
          console.log('Резюме обновлено', response);
          this.isLoading = false;
          this.router.navigate(['/app/profile']);
        },
        error: (error) => {
          console.error('Ошибка обновления резюме', error);
          this.isLoading = false;
          alert('Не удалось обновить резюме');
        }
      });
    }

    deleteResume(): void {
      this.isLoading = true;
      this.resumeService.deleteResume().subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/app/profile']);
        },
        error: (error) => {
          console.error('Ошибка удаления резюме', error);
          this.isLoading = false;
        }
      });
    }
  
}
