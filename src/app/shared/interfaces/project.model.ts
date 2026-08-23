export interface ProjectTranslation {
  languageCode: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  imageUrl: string;
}

export interface Project {
  id: number | string;
  categoryId?: number;
  category?: number | string;
  categoryName?: string;
  clientName?: string;
  client?: string;
  title?: string;
  coverImage?: string;
  image?: string;
  summary?: string;
  imageUrl?: string;
  createdAt?: string;
  year?: string | number;
  galleryImages?: GalleryImage[];
  translations?: ProjectTranslation[];
  [key: string]: any; // تسمح بأي خصائص إضافية موجودة في الـ Static Data القديمة
}

export interface PaginatedProjects {
  items: Project[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}
