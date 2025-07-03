import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USER_ROLE_KEY = 'user_role';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly TG_ID_KEY = 'tg_id';

  private readonly TOKEN_KEY = 'auth_token';

  public readonly apiUrl = 'https://tame-ducks-ring.loca.lt';

  public generateRandomId(): string {
    // Генерируем 10-значное число (от 1000000000 до 9999999999) для айди
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  constructor(private http: HttpClient) { }

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
    const userData = {
      tg: tgId,
      user_role: role,
      user_name: name
    };
    return this.http.post(`${this.apiUrl}/profile/init`, userData);
  }

  login(tgId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/login`, { tg: tgId });
  }

  getEmployerProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employers/${id}`);
  }
  
}