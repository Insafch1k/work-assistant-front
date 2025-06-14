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

  constructor (
    private telegramService: TelegramService,
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.userName = this.telegramService.getUserName();

    const savedRole = this.userService.getUserRole();
    if (savedRole === 'finder' || savedRole === 'employer') {
      this.selectedRole = savedRole as 'finder' | 'employer';
    }
  }

  selectRoleByImage(role: 'finder' | 'employer'): void {
    this.selectedRole = role;
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
    
    // пока просто сохраняем в localStorage
    this.userService.saveUserRole(this.selectedRole);
    this.userService.saveUserName(this.userName);
  
    this.router.navigate(['/profile']);
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
