import { Component, OnInit } from '@angular/core';
import { AdminService, User, Vacancy, UsersResponse, VacanciesResponse } from 'src/app/services/admin.service';
import { TelegramService } from 'src/app/services/telegram.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MetricsService, MetricsData, MetricsWindow } from '../../services/metrics.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  isAdmin: boolean = false;
  metrics: MetricsData | null = null;
  selectedWindow: MetricsWindow = 'today';
  metricsExpanded: boolean = false;
  moderationExpanded: boolean = false;

  // Данные для модерации пользователей
  users: User[] = [];
  currentUserPage = 1;
  totalUserPages = 0;
  userSearchTerm = '';
  usersLoading = false;

  // Данные для модерации вакансий
  // vacancies: Vacancy[] = [];
  currentVacancyPage = 1;
  totalVacancyPages = 0;
  vacanciesLoading = false;

  // Подтверждение удаления
  showDeleteConfirm = false;
  itemToDelete: { type: 'user' | 'vacancy', id: string, name: string } | null = null;

  constructor(
    private adminService: AdminService,
    private telegramService: TelegramService,
    private userService: UserService,
    private metricsService: MetricsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
  }

  //Проверяет права доступа к админ панели
  private checkAdminAccess(): void {
    let tgId = this.telegramService.getUserId();
    
    // Если Telegram ID не получен из Telegram WebApp, берем из localStorage
    if (!tgId) {
      tgId = this.userService.getTgId();
    }
    
    if (!tgId) {
      this.router.navigate(['/app/authorization']);
      return;
    }

    // Проверяем права админа через API
    this.adminService.isAdmin().subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
        if (!isAdmin) {
          this.router.navigate(['/app/authorization']);
          return;
        }
        // Не загружаем метрики сразу - только при раскрытии блока
      },
      error: (error) => {
        console.error('Ошибка проверки прав админа:', error);
        this.router.navigate(['/app/authorization']);
        return;
      }
    });
  }

  //Загружает метрики сервиса
  private loadMetrics(): void {
    this.metricsService.getMetrics('day', 30, this.selectedWindow).subscribe({
      next: (data: MetricsData) => {
        this.metrics = data;
      },
      error: (error: any) => {
        console.error('Ошибка загрузки метрик:', error);
      }
    });
  }

  onWindowChange(window: MetricsWindow): void {
    this.selectedWindow = window;
    this.loadMetrics();
  }


  //Возврат к авторизации
  goBack(): void {
    this.router.navigate(['/app/profile']);
  }

  toggleMetrics(): void {
    this.metricsExpanded = !this.metricsExpanded;
    
    // Загружаем метрики только при первом раскрытии
    if (this.metricsExpanded && !this.metrics) {
      this.loadMetrics();
    }
  }

  toggleModeration(): void {
    this.moderationExpanded = !this.moderationExpanded;
    if (this.moderationExpanded && this.users.length === 0) {
      this.loadUsers();
      // this.loadVacancies();
    }
  }

  //Форматирует число для отображения
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  //Форматирует дату для отображения
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Методы для работы с пользователями
  loadUsers(page: number = 1): void {
    this.usersLoading = true;
    this.adminService.getUsers({
      limit: 20,
      offset: (page - 1) * 20,
      name_filter: this.userSearchTerm || undefined
    }).subscribe({
      next: (response: UsersResponse) => {
        // Устанавливаем статус по умолчанию для пользователей
        this.users = response.data.map(user => ({
          ...user,
          status: user.status || 'active' // По умолчанию активен
        }));
        // Пока нет total в ответе, используем длину массива
        this.totalUserPages = Math.ceil(response.data.length / 20);
        this.currentUserPage = page;
        this.usersLoading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователей:', error);
        this.usersLoading = false;
      }
    });
  }

  onUserSearch(): void {
    this.currentUserPage = 1;
    this.loadUsers(1);
  }

  banUser(user: User): void {
    this.itemToDelete = {
      type: 'user',
      id: user.user_id.toString(),
      name: user.user_name
    };
    this.showDeleteConfirm = true;
  }

  unbanUser(user: User): void {
    this.adminService.unbanUser(user.user_id.toString()).subscribe({
      next: () => {
        // Обновляем статус пользователя локально
        user.status = 'active';
      },
      error: (error) => {
        console.error('Ошибка разбана пользователя:', error);
      }
    });
  }

  // Методы для работы с вакансиями
  // loadVacancies(page: number = 1): void {
  //   this.vacanciesLoading = true;
  //   this.adminService.getVacanciesForModeration({
  //     limit: 10,
  //     offset: (page - 1) * 10
  //   }).subscribe({
  //     next: (response: VacanciesResponse) => {
  //       this.vacancies = response.vacancies;
  //       this.totalVacancyPages = Math.ceil(response.total / 10);
  //       this.currentVacancyPage = page;
  //       this.vacanciesLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Ошибка загрузки вакансий:', error);
  //       this.vacanciesLoading = false;
  //     }
  //   });
  // }

  deleteVacancy(vacancy: Vacancy): void {
    this.itemToDelete = {
      type: 'vacancy',
      id: vacancy.id,
      name: vacancy.title
    };
    this.showDeleteConfirm = true;
  }

  // Подтверждение удаления
  confirmDelete(): void {
    if (!this.itemToDelete) return;

    if (this.itemToDelete.type === 'user') {
      this.adminService.banUser(this.itemToDelete.id).subscribe({
        next: () => {
          // Обновляем статус пользователя локально
          const user = this.users.find(u => u.user_id.toString() === this.itemToDelete!.id);
          if (user) {
            user.status = 'banned';
          }
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Ошибка бана пользователя:', error);
        }
      });
    } else if (this.itemToDelete.type === 'vacancy') {
      this.adminService.deleteVacancy(this.itemToDelete.id).subscribe({
        next: () => {
          // this.loadVacancies(this.currentVacancyPage);
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Ошибка удаления вакансии:', error);
        }
      });
    }
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.itemToDelete = null;
  }

  // Вспомогательные методы для пагинации
  getVacancyPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentVacancyPage - 2);
    const endPage = Math.min(this.totalVacancyPages, this.currentVacancyPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getUserPages(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentUserPage - 2);
    const endPage = Math.min(this.totalUserPages, this.currentUserPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}