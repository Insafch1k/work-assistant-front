import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TelegramService } from 'src/app/services/telegram.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit{
  userName: string = '';
  selectedRole: 'finder' | 'employer' | '' = '';
  formSubmitted: boolean = false;
  hoverRole: 'employer' | 'finder' | '' = '';
  registrationMessage: string = '';
  isLoading: boolean = false;

  private isProcessing = false;

  constructor (
    private telegramService: TelegramService,
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // принудительная отчистка роли
    this.userService.saveUserRole('');

    this.userName = this.telegramService.getUserName();
    let tgId = this.telegramService.getUserId();

    // Если Telegram ID не получен из Telegram WebApp, берем из localStorage
    if (!tgId) {
      tgId = this.userService.getTgId();
    }

    if (tgId) {
      this.userService.saveTgId(tgId);
    }

    const savedRole = this.userService.getUserRole();
    if (savedRole === 'finder' || savedRole === 'employer') {
      this.selectedRole = savedRole as 'finder' | 'employer';
    }
  }

  selectRoleByImage(role: 'finder' | 'employer', event: Event): void {
    if (this.isProcessing) return;
    
    // Полностью останавливаем все события
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    
    // Добавляем проверку, чтобы не менять уже выбранную роль
    if (this.selectedRole === role) return;
    
    this.isProcessing = true;
    
    // Используем requestAnimationFrame для более плавного обновления UI
    requestAnimationFrame(() => {
      this.selectedRole = role;
      
      // Используем более длительную задержку
      setTimeout(() => {
        this.isProcessing = false;
      }, 300);
    });
  }

  onRoleDropdownChange(event: any): void {
    const selectedValue = event.target.value;

    if (selectedValue === 'finder' || selectedValue === 'employer') {
      this.selectedRole = selectedValue as 'finder' | 'employer';
    } else {
      this.selectedRole = '';
    }
  }

  isFormValid(): boolean {
    const isNameValid = !!(this.userName && this.userName.trim().length >= 2);
    const isRoleValid = this.selectedRole === 'finder' || this.selectedRole === 'employer';
    return isNameValid && isRoleValid;
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (!this.isFormValid()) return;

    const tgId = this.telegramService.getUserId();
    this.userService.saveTgId(tgId);

    this.userService.saveUserRole(this.selectedRole);
    this.userService.saveUserName(this.userName);

    this.isLoading = true;

    // СНАЧАЛА ПРОБУЕМ ЛОГИН
    this.userService.login(tgId, this.selectedRole).subscribe({
      next: (loginResponse) => {
        if (loginResponse && loginResponse.access_token) {
          this.userService.saveToken(loginResponse.access_token);
          this.registrationMessage = 'Авторизация успешна';
          setTimeout(() => {
            this.router.navigate(['/app/profile']);
          }, 1000);
        } else {
          this.registrationMessage = 'Ошибка получения токена';
        }
        this.isLoading = false;
      },
      error: (loginError) => {
        // Если не найден — пробуем регистрацию
        if (loginError.status === 404 || loginError.status === 400) {
          this.userService.registerUser(tgId, this.selectedRole, this.userName).subscribe({
            next: (initResponse) => {
              if (initResponse && initResponse.access_token) {
                this.userService.saveToken(initResponse.access_token);
                this.registrationMessage = 'Регистрация успешна';
                
                setTimeout(() => {
                  this.router.navigate(['/app/profile']);
                }, 1000);
              } else {
                this.registrationMessage = 'Ошибка получения токена при регистрации';
              }
              this.isLoading = false;
            },
            error: (regError) => {
              console.error('Ошибка регистрации:', regError);
              this.registrationMessage = 'Ошибка регистрации';
              this.isLoading = false;
            }
          });
        } else {
          console.error('Ошибка входа:', loginError);
          this.registrationMessage = 'Произошла ошибка при входе';
          this.isLoading = false;
        }
      }
    });
  }

  getRoleName(role: string):string {
    if (role === 'finder') {
      return 'Я соискатель';
    } else if (role === 'employer') {
      return 'Я работодатель';
    }
    return 'Выберите роль';
  }
}
