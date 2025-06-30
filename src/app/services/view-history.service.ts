import { Injectable } from '@angular/core';
import { Vacancy } from '../models/vacancy.model';

@Injectable({
  providedIn: 'root'
})
export class ViewHistoryService {
  private viewedVacancies: Vacancy[] = [];
  
  // constructor() {
  //   this.loadFromLocalStorage();
  // }
  
  // // Добавить вакансию в историю просмотров
  // addToHistory(vacancy: Vacancy): void {
  //   // Проверяем, есть ли уже эта вакансия в истории
  //   const existingIndex = this.viewedVacancies.findIndex(v => v.job_id === vacancy.job_id);
    
  //   // Если вакансия уже есть, удаляем ее
  //   if (existingIndex !== -1) {
  //     this.viewedVacancies.splice(existingIndex, 1);
  //   }
    
  //   // Добавляем вакансию в начало списка
  //   this.viewedVacancies.unshift(vacancy);
    
  //   // Ограничиваем историю до 20 элементов
  //   if (this.viewedVacancies.length > 20) {
  //     this.viewedVacancies = this.viewedVacancies.slice(0, 20);
  //   }
    
  //   this.saveToLocalStorage();
  // }
  
  // // Получить все просмотренные вакансии
  // getViewedVacancies(): Vacancy[] {
  //   return this.viewedVacancies;
  // }
  
  // // Сохранение в локальное хранилище
  // private saveToLocalStorage(): void {
  //   localStorage.setItem('viewedVacancies', JSON.stringify(this.viewedVacancies));
  // }
  
  // // Загрузка из локального хранилища
  // private loadFromLocalStorage(): void {
  //   const saved = localStorage.getItem('viewedVacancies');
  //   if (saved) {
  //     this.viewedVacancies = JSON.parse(saved);
  //   }
  // }
}