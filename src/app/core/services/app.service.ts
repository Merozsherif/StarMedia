import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

const LANG_STORAGE_KEY = 'sm-lang';
const THEME_STORAGE_KEY = 'sm-theme';
const TOKEN_STORAGE_KEY = 'admin_token';// مفتاح التوكن عندك (غيره لو اسم التوكن مختلف في مشروعك)

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public baseUrl = 'https://productionhouse-production.up.railway.app/api';

  currentLang = signal<'en' | 'ar'>('en');
  theme = signal<'light' | 'dark'>('light');

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      // 1. استرجاع اللغة
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'ar' || savedLang === 'en') {
        this.currentLang.set(savedLang);
      }

      // 2. استرجاع الثيم وتطبيقه على الـ DOM
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark';
      if (savedTheme) {
        this.theme.set(savedTheme);
        this.applyThemeToDOM(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme.set('dark');
        this.applyThemeToDOM('dark');
      }
    }
  }

  // دالة مساعدة لتطبيق كلاس الـ dark على عنصر الـ html
  private applyThemeToDOM(theme: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  t(enText: string, arText: string): string {
    return this.currentLang() === 'ar' ? arText : enText;
  }

  toggleLanguage(): void {
    this.currentLang.update(lang => {
      const next = lang === 'en' ? 'ar' : 'en';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      }
      return next;
    });
  }

  toggleLang(): void {
    this.toggleLanguage();
  }

  // تبديل الثيم وحفظه وتطبيقه فورا
  toggleTheme() {
    this.theme.update(t => {
      const next = t === 'light' ? 'dark' : 'light';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      this.applyThemeToDOM(next);
      return next;
    });
  }

  lang(): 'en' | 'ar' {
    return this.currentLang();
  }

  // دالة مساعدة لإرفاق التوكن تلقائياً مع أي طلب API يحتاجه
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getAdminStats(): Observable<any> {
    return this.get<any>('Admin/stats');
  }

  getCategoryDropdown(): Observable<any> {
    return this.get<any>('Categories/dropdown');
  }

  // دمج التوكن تلقائياً مع الـ Requests
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    const authHeaders = this.getAuthHeaders();
    let headers = options?.headers instanceof HttpHeaders
      ? options.headers
      : new HttpHeaders(options?.headers || {});

    // دمج التوكن لو مش موجود
    keys: for (const key of authHeaders.keys()) {
      if (!headers.has(key)) {
        headers = headers.set(key, authHeaders.get(key)!);
      }
    }

    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers,
      observe: 'body'
    });
  }

  post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const authHeaders = this.getAuthHeaders();
    let headers = options?.headers instanceof HttpHeaders
      ? options.headers
      : new HttpHeaders(options?.headers || {});

    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      ...options,
      headers: headers.has('Authorization') ? headers : headers.set('Authorization', authHeaders.get('Authorization') || ''),
      observe: 'body'
    });
  }

  put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<T> {
    const authHeaders = this.getAuthHeaders();
    let headers = options?.headers instanceof HttpHeaders
      ? options.headers
      : new HttpHeaders(options?.headers || {});

    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
      ...options,
      headers: headers.has('Authorization') ? headers : headers.set('Authorization', authHeaders.get('Authorization') || ''),
      observe: 'body'
    });
  }

 delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
  const authHeaders = this.getAuthHeaders();
  let headers = options?.headers instanceof HttpHeaders
    ? options.headers
    : new HttpHeaders(options?.headers || {});

  return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
    ...options,
    headers: headers.has('Authorization') ? headers : headers.set('Authorization', authHeaders.get('Authorization') || ''),
    observe: 'body',
    responseType: 'text' as 'json'   // 👈 يمنع محاولة الـ JSON.parse للـ body الفاضي
  });
}
}
