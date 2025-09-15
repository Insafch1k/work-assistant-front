import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // список tg id админов
  private readonly ADMIN_TELEGRAM_IDS = [
    '864084413', 
    '784259987',
    '5625857252',
    '825963774',
    '1035648673',
    '653498682',
    

  ];


  
  constructor() {}

  isAdmin(telegramId: string): boolean {
    if (!telegramId) {
      return false;
    }
    return this.ADMIN_TELEGRAM_IDS.includes(telegramId);
  }
}
