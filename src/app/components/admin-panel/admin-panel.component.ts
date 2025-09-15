import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
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

    this.isAdmin = this.adminService.isAdmin(tgId);
    
    if (!this.isAdmin) {
      this.router.navigate(['/app/authorization']);
      return;
    }

    this.loadMetrics();
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
    this.router.navigate(['/app/authorization']);
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
}