import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AppService } from './app.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'admin_token';
  private readonly userKey = 'user_info';

  constructor(
    private http: HttpClient,
    private appService: AppService
  ) {}

  // 1. تسجيل الدخول بحسب الـ Swagger API: /api/Auth/Login
  login(credentials: LoginRequest): Observable<ApiResponse<UserData>> {
    return this.http.post<ApiResponse<UserData>>(`${this.appService.baseUrl}/Auth/Login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.data?.token) {
          // حفظ التوكن وبيانات الأدمن فور نجاح التسجيل
          this.setSession(res.data.token, res.data);
        }
      })
    );
  }

  // 2. جلب البيانات الخاصة بالحساب الحالي: /api/Auth/Me
  getCurrentUser(): Observable<ApiResponse<UserData>> {
    return this.http.get<ApiResponse<UserData>>(`${this.appService.baseUrl}/api/Auth/Me`);
  }

  // 3. تغيير كلمة المرور: /api/Auth/Change-Password
  changePassword(passwords: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.appService.baseUrl}/api/Auth/Change-Password`, passwords);
  }

  // 4. تسجيل الخروج
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  // 5. حفظ الجلسة في الـ LocalStorage
  private setSession(token: string, user: UserData): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // 6. الحصول على التوكن المحفوظ
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // 7. التأكد من حالة تسجيل الدخول
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
