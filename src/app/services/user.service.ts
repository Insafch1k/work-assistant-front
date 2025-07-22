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
  private readonly TOKEN_KEY = 'auth_token';
  private readonly PROFILE_CACHE_KEY = 'profile_cache';
  private readonly PROFILE_PHOTO_KEY = 'profile_photo';

  public readonly apiUrl = 'https://cruel-actors-bathe.loca.lt/api';

  constructor(
    private http: HttpClient,
    private telegramService: TelegramService
  ) {}

  // --- Методы для TG ID ---
  saveTgId(tgId: string): void {
    localStorage.setItem(this.TG_ID_KEY, tgId);
  }

  getTgId(): string {
    return localStorage.getItem(this.TG_ID_KEY) || '';
  }

  // --- Методы для токена ---
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) || '';
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // --- Кэширование профиля и фото ---
  cacheProfile(profile: any): void {
    localStorage.setItem(this.PROFILE_CACHE_KEY, JSON.stringify(profile));
    if (profile.photo) {
      localStorage.setItem(this.PROFILE_PHOTO_KEY, profile.photo);
    }
  }

  getCachedProfile(): any | null {
    const data = localStorage.getItem(this.PROFILE_CACHE_KEY);
    return data ? JSON.parse(data) : null;
  }

  cacheProfilePhoto(photo: string): void {
    localStorage.setItem(this.PROFILE_PHOTO_KEY, photo);
  }

  getCachedProfilePhoto(): string | null {
    return localStorage.getItem(this.PROFILE_PHOTO_KEY);
  }

  clearProfileCache(): void {
    localStorage.removeItem(this.PROFILE_CACHE_KEY);
    localStorage.removeItem(this.PROFILE_PHOTO_KEY);
  }

  // --- Роль и имя пользователя ---
  getUserRole(): string {
    return localStorage.getItem(this.USER_ROLE_KEY) || '';
  }

  saveUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  getUserName(): string {
    return localStorage.getItem(this.USER_NAME_KEY) || '';
  }

  saveUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  // --- API методы ---
  registerUser(tgId: string, role: string, name: string): Observable<any> {
    const userData = {
      tg: tgId,
      user_role: role,
      user_name: name,
      // tg_username: this.telegramService.getUserUsername(),
      // photo: this.telegramService.getUserPhotoUrl()
      tg_username: '@qwerty1',
      photo: "https://multi-admin.ru/mediabank_blog/11/248087/8f425a5d663dde66070340637cbb48b83o70mgluoka.jpg"
    };
    return this.http.post(`${this.apiUrl}/profile/init`, userData);
  }

  login(tgId: string, role: string): Observable<any> {
    const body = {
      tg: tgId,
      user_role: role,
      // tg_username: this.telegramService.getUserUsername(),
      // photo: this.telegramService.getUserPhotoUrl()
      tg_username: '@qwerty1',
      photo: "https://multi-admin.ru/mediabank_blog/11/248087/8f425a5d663dde66070340637cbb48b83o70mgluoka.jpg"
    };
    return this.http.patch(`${this.apiUrl}/profile/login`, body);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/me`);
  }

  getEmployerProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employers/${id}`);
  }

  updateEmployerPhone(phone: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, { phone });
  }
}