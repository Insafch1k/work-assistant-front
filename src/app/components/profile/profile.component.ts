import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ResumeService } from 'src/app/services/resume.service';
import { Resume } from 'src/app/models/resume.model';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor (
    private userService: UserService,
    private resumeService: ResumeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userName = this.userService.getUserName();
    this.userRole = this.userService.getUserRole();
    this.editableName = this.userName;

    // Проверяем, пришли ли мы со страницы создания резюме
    this.route.queryParams.subscribe(params => {
      const fromResume = params['fromResume'];
      const cacheParam = params['timestamp'] || new Date().getTime();
      
      // Загружаем резюме с указанием временной метки
      if (this.userRole === 'finder') {
        this.loadUserResume(cacheParam);
      }
    });
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
        // Если ошибка 500, это может быть из-за отсутствия резюме
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
