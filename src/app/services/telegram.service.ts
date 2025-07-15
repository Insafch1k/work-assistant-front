import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  constructor() {}

  getUserName(): string {
    if (window.Telegram && window.Telegram.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user?.first_name || '';
    }
    return '';
  }

  getUserId(): string {
    if (window.Telegram && window.Telegram.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user?.id?.toString() || '';
    } 
    return '';
  }

  getUserPhone(): string {
    if (window.Telegram && window.Telegram.WebApp) {
      return window.Telegram.WebApp.initDataUnsafe?.user?.phone_number || '';
    }
    return '';
  }
  
  getUserUsername(): string {
    if (window.Telegram && window.Telegram.WebApp) {
      const username = window.Telegram.WebApp.initDataUnsafe?.user?.username;
      return username ? '@' + username : '';
    }
    return '';
  }
}

