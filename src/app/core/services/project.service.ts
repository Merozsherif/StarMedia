import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { PaginatedProjects, Project, ApiResponse } from '../../shared/interfaces/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'Projects';

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

  getAllProjects(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    categoryId?: number,
    isPublished?: boolean,
    isFeatured?: boolean,
    sortBy?: string,
    desc?: boolean
  ): Observable<PaginatedProjects> {
    let query = `${this.baseUrl}/Get-All?Page=${page}&PageSize=${pageSize}`;

    if (search) query += `&Search=${encodeURIComponent(search)}`;
    if (categoryId) query += `&CategoryId=${categoryId}`;
    if (isPublished !== undefined) query += `&IsPublished=${isPublished}`;
    if (isFeatured !== undefined) query += `&IsFeatured=${isFeatured}`;
    if (sortBy) query += `&SortBy=${sortBy}`;
    if (desc !== undefined) query += `&Desc=${desc}`;

    return this.appService.get<ApiResponse<PaginatedProjects>>(query).pipe(
      map(response => response.data)
    );
  }

  getProjectById(id: number): Observable<Project> {
    return this.appService.get<ApiResponse<Project>>(`${this.baseUrl}/Get-By-Id/${id}`).pipe(
      map(response => response.data)
    );
  }

  createProject(formData: FormData): Observable<any> {
    return this.appService.post<any>(`${this.baseUrl}/Add`, formData, { headers: this.getAuthHeaders() });
  }

  updateProject(id: number, formData: FormData): Observable<any> {
    return this.appService.put<any>(`${this.baseUrl}/Update/${id}`, formData, { headers: this.getAuthHeaders() });
  }

deleteProject(id: number): Observable<ApiResponse<any>> {
  return this.appService.delete<ApiResponse<any>>(
    `${this.baseUrl}/Delete/${id}`,
    { headers: this.getAuthHeaders() }
  );
}
  uploadGallery(id: number, formData: FormData): Observable<any> {
    return this.appService.post<any>(`${this.baseUrl}/Upload-Gallery/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  changeCover(id: number, formData: FormData): Observable<any> {
    return this.appService.put<any>(`${this.baseUrl}/Change-Cover/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  deleteGalleryImage(imageId: number): Observable<any> {
    return this.appService.delete<any>(`${this.baseUrl}/Delete-Gallery-Image/${imageId}`, { headers: this.getAuthHeaders() });
  }
}
