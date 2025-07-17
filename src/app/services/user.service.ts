import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TelegramService } from './telegram.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_ROLE_KEY = 'user_role';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly TG_ID_KEY = 'tg_id';
  private readonly PHONE_KEY = 'phone';
  private readonly TG_USERNAME_KEY = 'tg_username';

  private readonly TOKEN_KEY = 'auth_token';

  public readonly apiUrl = 'http://192.168.240.93:8000/api';

  constructor(
    private http: HttpClient,
    private telegramService: TelegramService
  ) { }

  getUserRole():string {
    return localStorage.getItem(this.USER_ROLE_KEY) || '';
  }

  getUserName(): string {
    return localStorage.getItem(this.USER_NAME_KEY) || '';
  }

  getTgId(): string {
    return localStorage.getItem(this.TG_ID_KEY) || '';
  }

  saveUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role)
  }

  saveUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  saveTgId(tgId: string): void {
    localStorage.setItem(this.TG_ID_KEY, tgId);
  }

  saveToken(token:string):void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) || '';
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  registerUser(tgId: string, role: string, name: string): Observable<any> {
    const tgUsername = this.telegramService.getUserUsername();
    const photoUrl = this.telegramService.getUserPhotoUrl(); 
    const userData = {
      tg: tgId,
      user_role: role,
      user_name: name,
      tg_username: tgUsername,
      photo: photoUrl
    };
    return this.http.post(`${this.apiUrl}/profile/init`, userData);
  }

  login(tgId: string, role: string): Observable<any> {
    const photoUrl = this.telegramService.getUserPhotoUrl();
    const tgUsername = this.telegramService.getUserUsername();
    const body = {
      user_role: role,
      tg: tgId,
      photo: photoUrl,
      tg_username: tgUsername
    };
    return this.http.patch(`${this.apiUrl}/profile/login`, body);
  }

  getEmployerProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employers/${id}`);
  }

  updateEmployerPhone(phone: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, { phone });
  }

  savePhoneNumber(phone: string): void {
    localStorage.setItem(this.PHONE_KEY, phone);
  }
  
  getPhoneNumber(): string | null {
    return localStorage.getItem(this.PHONE_KEY);
  }
  
  getTgUsername(): string | null {
    return localStorage.getItem(this.TG_USERNAME_KEY);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/me`);
  }
}