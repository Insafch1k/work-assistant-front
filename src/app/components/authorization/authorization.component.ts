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
    this.userName = this.telegramService.getUserName();
    const tgId = this.telegramService.getUserId();

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
    
    if (!this.isFormValid()) {
      return;
    }
    
    // сохраняем данные пользователя
    this.userService.saveUserRole(this.selectedRole);
    this.userService.saveUserName(this.userName);
  
    this.isLoading = true;

    const tgId = this.userService.getTgId() || this.userService.generateRandomId();

    this.userService.saveTgId(tgId);

    // получаем токен с /profile/login
    const userData = {
      username: this.userName,
      role: this.selectedRole,
      tg: tgId
    };
  
    // this.userService.registerUser().subscribe({
    //   next: (initResponse) => {
    //     // После успешной регистрации делаем логин
    //     this.userService.login(userData).subscribe({
    //       next: (loginResponse) => {
    //         if (loginResponse && loginResponse.access_token) {
    //           this.userService.saveToken(loginResponse.access_token);
    //           this.registrationMessage = 'Авторизация успешна';
              
    //           setTimeout(() => {
    //             this.router.navigate(['/profile']);
    //           }, 1000);
    //         } else {
    //           this.registrationMessage = 'Ошибка получения токена';
    //         }
    //         this.isLoading = false;
    //       },
    //       error: (error) => {
    //         console.error('Ошибка входа:', error);
    //         this.registrationMessage = 'Произошла ошибка при входе';
    //         this.isLoading = false;
    //       }
    //     });
    //   },
    //   error: (error) => {
    //     console.error('Ошибка инициализации профиля:', error);
    //     this.registrationMessage = 'Ошибка инициализации профиля';
    //     this.isLoading = false;
    //   }
    // });

    const performLogin = () => {
      this.userService.login(userData).subscribe({
        next: (loginResponse) => {
          if (loginResponse && loginResponse.access_token) {
            this.userService.saveToken(loginResponse.access_token);
            this.registrationMessage = 'Авторизация успешна';
            
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 1000);
          } else {
            this.registrationMessage = 'Ошибка получения токена';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка входа:', error);
          this.registrationMessage = 'Произошла ошибка при входе';
          this.isLoading = false;
        }
      });
    };
  
    // Сначала попробуем выполнить логин напрямую
    performLogin();

  }

  getRoleName(role: string):string {
    if (role === 'finder') {
      return 'Я соискатель';
    } else if (role === 'employer') {
      return 'Я работодатель';
    }
    return 'Выберите роль';
  }

  // // временный переход на профиль без авторизации
  // bypassApiAndNavigate(): void {
  //   // Сохраняем данные
  //   this.userService.saveUserRole(this.selectedRole);
  //   this.userService.saveUserName(this.userName);
    
  //   // Переходим на профиль
  //   this.router.navigate(['/profile']);
  // }


}
