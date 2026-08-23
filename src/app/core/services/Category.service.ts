import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { Category, CategoryPayload } from '../../shared/interfaces/Category.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = 'Categories';

  constructor(
    private appService: AppService,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken() || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllCategories(): Observable<Category[]> {
    return this.appService.get<ApiResponse<Category[]>>(`${this.baseUrl}/Get-All`).pipe(
      map(response => response.data)
    );
  }

  createCategory(payload: CategoryPayload): Observable<ApiResponse<Category>> {
    return this.appService.post<ApiResponse<Category>>(`${this.baseUrl}/Add`, payload, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: number, payload: CategoryPayload): Observable<ApiResponse<Category>> {
    return this.appService.put<ApiResponse<Category>>(`${this.baseUrl}/Update/${id}`, { id, ...payload }, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: number): Observable<ApiResponse<boolean>> {
    return this.appService.delete<ApiResponse<boolean>>(`${this.baseUrl}/Delete/${id}`, { headers: this.getAuthHeaders() });
  }
}
