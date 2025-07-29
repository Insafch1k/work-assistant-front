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
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        // Принудительная проверка и приведение к строке
        console.log('Telegram WebApp:', window.Telegram.WebApp);
        console.log('initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe);

        const username = window.Telegram.WebApp.initDataUnsafe?.user?.username;
        console.log('Raw username:', username);
        
        return username ? '@' + String(username).trim() : '';
      }
    } catch (error) {
      console.error('Error getting Telegram username:', error);
    }
    return '';
  }

  getUserPhotoUrl() {
    // if (window.Telegram && window.Telegram.WebApp) {
    //   return window.Telegram.WebApp.initDataUnsafe?.user?.photo_url || '';
    // }
    // return '';
  }
}

