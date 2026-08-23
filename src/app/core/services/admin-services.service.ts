import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { ApiResponse } from './auth.service';

export interface ServiceItem {
  id?: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {
  private readonly endpoint = 'Services';

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

  getAllServices(): Observable<ApiResponse<ServiceItem[]>> {
    return this.appService.get<ApiResponse<ServiceItem[]>>(this.endpoint);
  }

  getServiceById(id: number): Observable<ApiResponse<ServiceItem>> {
    return this.appService.get<ApiResponse<ServiceItem>>(`${this.endpoint}/${id}`);
  }

  createService(data: FormData): Observable<ApiResponse<ServiceItem>> {
    return this.appService.post<ApiResponse<ServiceItem>>(this.endpoint, data, { headers: this.getAuthHeaders() });
  }

  updateService(id: number, data: FormData): Observable<ApiResponse<ServiceItem>> {
    return this.appService.put<ApiResponse<ServiceItem>>(`${this.endpoint}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteService(id: number): Observable<ApiResponse<boolean>> {
    return this.appService.delete<ApiResponse<boolean>>(`${this.endpoint}/${id}`, { headers: this.getAuthHeaders() });
  }
}
