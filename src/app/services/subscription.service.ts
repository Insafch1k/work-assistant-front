import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

export interface SubscriptionResponse {
  access: boolean;
  message: string;
  channel: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl: string;
  public showModal = false;
  public channelUrl = '';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.apiUrl = this.userService.apiUrl;
  }

  async checkSubscriptionAndExecute(jobId: number, action: () => void): Promise<void> {
    try {
      const response: SubscriptionResponse = await this.checkSubscriptionAsync(jobId);
      
      if (response.access) {
        action();
      } else {
        this.channelUrl = `https://t.me/${response.channel.replace('@', '')}`;
        this.showModal = true;
      }
    } catch (error) {
      console.error('Ошибка при проверке подписки:', error);
      this.channelUrl = 'https://t.me/канал';
      this.showModal = true;
    }
  }

  async checkSubscriptionAndNavigate(jobId: number, route: string[]): Promise<void> {
    await this.checkSubscriptionAndExecute(
      jobId,
      () => this.router.navigate(route)
    );
  }

  private checkSubscription(jobId: number): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(`${this.apiUrl}/jobs/${jobId}/check_subscription`);
  }

  private async checkSubscriptionAsync(jobId: number): Promise<SubscriptionResponse> {
    return new Promise((resolve, reject) => {
      this.checkSubscription(jobId).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error)
      });
    });
  }

  closeModal() {
    this.showModal = false;
  }

  openChannel() {
    window.open(this.channelUrl, '_blank');
  }
}