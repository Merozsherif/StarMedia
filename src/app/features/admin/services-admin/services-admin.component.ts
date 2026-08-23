import { Component, OnInit } from '@angular/core';
import { AdminServicesService, ServiceItem } from '../../../core/services/admin-services.service';
import { AppService } from '../../../core/services/app.service';

@Component({
  selector: 'app-services-admin',
  templateUrl: './services-admin.component.html',
  styleUrls: ['./services-admin.component.css']
})
export class ServicesAdminComponent implements OnInit {
  services: ServiceItem[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  // Modal State
  isModalOpen = false;
  isEditMode = false;
  selectedId: number | null = null;

  // Form Fields
  formData: ServiceItem = {
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: ''
  };
  selectedFile: File | null = null;

  constructor(
    private adminServices: AdminServicesService,
    public site: AppService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.adminServices.getAllServices().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success || res) {
          this.services = res.data || res;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'فشل في تحميل الخدمات من السيرفر';
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedId = null;
    this.formData = { titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '' };
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  openEditModal(service: ServiceItem): void {
    this.isEditMode = true;
    this.selectedId = service.id || null;
    this.formData = { ...service };
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveService(): void {
    this.isSaving = true;
    const body = new FormData();
    body.append('titleEn', this.formData.titleEn);
    body.append('titleAr', this.formData.titleAr);
    body.append('descriptionEn', this.formData.descriptionEn);
    body.append('descriptionAr', this.formData.descriptionAr);

    if (this.selectedFile) {
      body.append('image', this.selectedFile);
    }

    const request$ = this.isEditMode && this.selectedId
      ? this.adminServices.updateService(this.selectedId, body)
      : this.adminServices.createService(body);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadServices();
      },
      error: () => {
        this.isSaving = false;
        alert('حدث خطأ أثناء حفظ البيانات');
      }
    });
  }

  deleteService(id?: number): void {
    if (!id || !confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

    this.adminServices.deleteService(id).subscribe({
      next: () => {
        this.loadServices();
      },
      error: () => alert('فشل حذف الخدمة')
    });
  }
}
