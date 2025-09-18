import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './user.service';

export interface MetricsData {
  registeredUsers: number;
  activeUsers: number;
  newVacancies: number;
  responsesCount: number;
  responseRate: number;
}

export type MetricsWindow = 'today' | 'yesterday' | '7d' | '30d';

export interface TrackEventData {
  event_name: 'vacancy_sent';
  tg_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  /**
   * Получает метрики сервиса с бэкенда
   * @param period - период (hour, day, month, year)
   * @param limit - количество периодов
   * @returns Observable с данными метрик
   */
  getMetrics(period: string = 'day', limit: number = 30, window: MetricsWindow = 'today'): Observable<MetricsData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Получаем все метрики параллельно
    // Рассчитываем нужное количество точек, чтобы не тянуть лишние данные
    const windowDays = window === '7d' ? 7 : window === '30d' ? 30 : 1;
    const offset = window === 'yesterday' ? 1 : 0;
    const requestLimit = windowDays + offset;

    // Стратегии агрегации по окну
    const registeredUsers$ = this.getMetric('registered_users', period, requestLimit, window, 'sum');
    const activeUsers$ = this.getMetric('active_users', period, requestLimit, window, 'sum');
    const newVacancies$ = this.getMetric('new_vacancies', period, requestLimit, window, 'sum');
    const responsesCount$ = this.getMetric('responses_count', period, requestLimit, window, 'sum');
    const responseRate$ = this.getMetric('response_rate', period, requestLimit, window, 'avg');

    // Объединяем все метрики в один объект
    return forkJoin({
      registeredUsers: registeredUsers$,
      activeUsers: activeUsers$,
      newVacancies: newVacancies$,
      responsesCount: responsesCount$,
      responseRate: responseRate$
    }).pipe(
      catchError((error) => {
        console.error('Ошибка получения метрик:', error);
        // Возвращаем моковые данные в случае ошибки
        return of({
          registeredUsers: 0,
          activeUsers: 0,
          newVacancies: 0,
          responsesCount: 0,
          responseRate: 0
        });
      })
    );
  }

  /**
   * Получает конкретную метрику
   * @param metricName - название метрики
   * @param period - период
   * @param limit - лимит
   * @returns Observable с данными метрики
   */
  private getMetric(
    metricName: string,
    period: string,
    limit: number,
    window: MetricsWindow,
    strategy: 'sum' | 'avg'
  ): Observable<number> {
    // Ожидаем time-series от бэка и преобразуем в одно число для карточек
    interface MetricPoint { period: string; value: number; }
    interface MetricSeries {
      metric: string;
      period: string;
      total_periods: number;
      data: MetricPoint[];
    }

    return this.http
      .get<MetricSeries>(`${this.userService.apiUrl}/metrics/${metricName}?period=${period}&limit=${limit}`)
      .pipe(
        map((res) => {
          if (!res || !Array.isArray(res.data) || res.data.length === 0) {
            return 0;
          }
          // Отсортируем по дате возрастанию для предсказуемой агрегации
          const points = [...res.data].sort((a, b) => a.period.localeCompare(b.period));

          // Специальная обработка today/yesterday: ищем точное совпадение даты (YYYY-MM-DD)
          const todayIso = new Date().toISOString().slice(0, 10);
          const yestIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

          if (window === 'today') {
            const p = points.find(pt => pt.period === todayIso) ?? points[points.length - 1];
            const v = Number(p?.value ?? 0);
            return Number.isFinite(v) ? v : 0;
          }

          if (window === 'yesterday') {
            const p = points.find(pt => pt.period === yestIso)
              ?? points[points.length - 2]
              ?? points[points.length - 1];
            const v = Number(p?.value ?? 0);
            return Number.isFinite(v) ? v : 0;
          }

          // Для 7d/30d берём последние N точек
          const windowDays = window === '7d' ? 7 : 30;
          const tail = points.slice(-Math.min(points.length, windowDays));
          if (tail.length === 0) {
            return 0;
          }
          const values = tail.map(p => Number(p?.value ?? 0)).filter(v => Number.isFinite(v));
          if (values.length === 0) {
            return 0;
          }
          if (strategy === 'sum') {
            return values.reduce((sum, v) => sum + v, 0);
          }
          const sum = values.reduce((s, v) => s + v, 0);
          return sum / values.length;
        }),
        catchError((error) => {
          console.error(`Ошибка получения метрики ${metricName}:`, error);
          return of(0); // Возвращаем 0 в случае ошибки
        })
      );
  }

  /**
   * Отправляет событие для трекинга
   * @param eventData - данные события
   * @returns Observable с результатом
   */
  trackEvent(eventData: TrackEventData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.userService.apiUrl}/metrics/track_event`, eventData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Ошибка отправки события:', error);
          return of(null);
        })
      );
  }

  /**
   * Отправляет событие отклика на вакансию
   * @param userId - ID пользователя
   */
  trackVacancySent(tgId: string): void {
    this.trackEvent({
      event_name: 'vacancy_sent',
      tg_id: tgId
    }).subscribe();
  }

}