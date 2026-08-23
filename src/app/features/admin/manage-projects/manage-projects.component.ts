import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProjectService } from '../../../core/services/project.service';
import { AppService } from '../../../core/services/app.service';
import { Project, PaginatedProjects } from '../../../shared/interfaces/project.model';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmDialogService } from '../../../shared/Confirm/confirm-dialog.service';


@Component({
  selector: 'app-manage-projects',
  templateUrl: './manage-projects.component.html',
  styleUrls: ['./manage-projects.component.css']
})
export class ManageProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  categories = signal<any[]>([]);

  // ✅ Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalCount = signal<number>(0);
  totalPages = signal<number>(0);

  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  isFormView = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  projectId: number | null = null;

  projectForm!: FormGroup;

  // ✅ الشهور بالاسم (EN/AR) - القيمة المخزنة رقم من 1 لـ 12
  readonly months = [
    { value: 1, en: 'January', ar: 'يناير' },
    { value: 2, en: 'February', ar: 'فبراير' },
    { value: 3, en: 'March', ar: 'مارس' },
    { value: 4, en: 'April', ar: 'أبريل' },
    { value: 5, en: 'May', ar: 'مايو' },
    { value: 6, en: 'June', ar: 'يونيو' },
    { value: 7, en: 'July', ar: 'يوليو' },
    { value: 8, en: 'August', ar: 'أغسطس' },
    { value: 9, en: 'September', ar: 'سبتمبر' },
    { value: 10, en: 'October', ar: 'أكتوبر' },
    { value: 11, en: 'November', ar: 'نوفمبر' },
    { value: 12, en: 'December', ar: 'ديسمبر' },
  ];

  // ✅ من 2015 لحد السنة الحالية، مرتبة تنازلي (الأحدث أولًا)
  readonly years: number[] = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  getMonthName(value: number): string {
    const m = this.months.find(x => x.value === value);
    if (!m) return '';
    return this.site.currentLang() === 'ar' ? m.ar : m.en;
  }

  // متغيرات الـ Cover باستخدام مكتبة الـ Cropper
  selectedCoverFile: File | null = null;
  currentCoverUrl: string | null = null;
  imageChangedEvent: any = '';

  // القيمة النهائية المؤكدة (اللي هتتبعت فعلاً وتتعرض كـ preview)
  croppedImageFile: File | null = null;
  croppedImagePreview: string | null = null;

  // القيمة المؤقتة أثناء تحريك مربع القص، لحد ما يدوس "حفظ"
  private tempCroppedBlob: Blob | null = null;
  private tempCroppedPreview: string | null = null;

  // Gallery Management
  existingGalleryImages: any[] = [];
  selectedGalleryFiles: File[] = [];
  galleryPreviews: string[] = [];
  imagesToDelete: number[] = [];

  constructor(
    private projectService: ProjectService,
    public site: AppService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategoriesDropdown();
    this.loadProjects();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      // 🇬🇧 English fields
      titleEn: ['', Validators.required],
      descriptionEn: [''],
      // 🇸🇦 Arabic fields
      titleAr: ['', Validators.required],
      descriptionAr: [''],
      // Shared fields (not translated)
      clientName: ['', Validators.required],
      categoryId: ['', Validators.required],
      // ✅ الحقول الجديدة
      location: [''],
      completionMonth: [null],
      completionYear: [null]
    });
  }

  loadCategoriesDropdown(): void {
    this.site.getCategoryDropdown().subscribe({
      next: (res: any) => {
        const list = res.data || res;
        this.categories.set(list);
      },
      error: (err: any) => {
        console.error('Failed to load category dropdown:', err);
        this.toast.error('Failed to load categories', 'فشل في تحميل الأقسام');
      }
    });
  }

  // ============== Pagination ==============

  loadProjects(page: number = 1): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.projectService.getAllProjects(page, this.pageSize()).subscribe({
      next: (data: any) => {
        const result = data?.data ?? data;

        this.projects.set(result.items || []);
        this.totalCount.set(result.totalCount || 0);
        this.totalPages.set(
          this.pageSize() > 0 ? Math.ceil(this.totalCount() / this.pageSize()) : 1
        );
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading projects:', err);
        this.errorMessage.set(this.site.t('Failed to fetch projects.', 'فشل في جلب المشاريع.'));
        this.isLoading.set(false);
        this.toast.error('Failed to fetch projects', 'فشل في جلب المشاريع');
      }
    });
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadProjects(this.currentPage() + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.loadProjects(this.currentPage() - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.loadProjects(page);
    }
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  // ============== 🔧 دالة موحّدة لحل مشكلة روابط الصور (Cloudinary أو مسار محلي) ==============
  private resolveImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      // رابط كامل جاهز (Cloudinary أو أي CDN تاني) - يتستخدم زي ما هو
      return path;
    }
    // مسار نسبي قديم (لو موجود) - يتحط قبله الـ baseUrl
    return `${this.site.baseUrl.replace('/api', '')}/${path}`;
  }

  openAddForm(): void {
    this.isEditMode.set(false);
    this.projectId = null;
    this.currentCoverUrl = null;
    this.imageChangedEvent = '';
    this.croppedImageFile = null;
    this.croppedImagePreview = null;
    this.selectedCoverFile = null;
    this.tempCroppedBlob = null;
    this.tempCroppedPreview = null;
    this.existingGalleryImages = [];
    this.selectedGalleryFiles = [];
    this.galleryPreviews = [];
    this.imagesToDelete = [];
    this.projectForm.reset({ categoryId: '', location: '', completionMonth: null, completionYear: null });
    this.isFormView.set(true);
  }

  openEditForm(id?: number): void {
    if (!id) return;
    this.isLoading.set(true);
    this.projectId = id;
    this.isEditMode.set(true);
    this.imageChangedEvent = '';
    this.croppedImageFile = null;
    this.tempCroppedBlob = null;
    this.tempCroppedPreview = null;
    this.selectedGalleryFiles = [];
    this.galleryPreviews = [];
    this.imagesToDelete = [];

    this.projectService.getProjectById(id).subscribe({
      next: (project: Project) => {
        this.currentCoverUrl = project.coverImage || null;
        // ✅ استخدام resolveImageUrl بدل تركيب baseUrl مباشرة
        this.croppedImagePreview = this.resolveImageUrl(project.coverImage);

        this.existingGalleryImages = (project as any).galleryImages || (project as any).images || [];

        // ✅ جلب الترجمة الإنجليزية والعربية كل واحدة على حدة
        const enTranslation = project.translations?.find(
          t => t.languageCode?.toLowerCase() === 'en'
        );
        const arTranslation = project.translations?.find(
          t => t.languageCode?.toLowerCase() === 'ar'
        );

        this.projectForm.patchValue({
          titleEn: enTranslation?.title || project.title || '',
          descriptionEn: enTranslation?.description || '',
          titleAr: arTranslation?.title || '',
          descriptionAr: arTranslation?.description || '',
          clientName: project.clientName || '',
          categoryId: project.categoryId || '',
          // ✅ الحقول الجديدة
          location: (project as any).location || '',
          completionMonth: (project as any).completionMonth ?? null,
          completionYear: (project as any).completionYear ?? null
        });

        this.isLoading.set(false);
        this.isFormView.set(true);
      },
      error: (err: any) => {
        console.error('Error fetching project details:', err);
        this.errorMessage.set(this.site.t('Failed to load project details', 'فشل في جلب تفاصيل المشروع'));
        this.isLoading.set(false);
        this.toast.error('Failed to load project details', 'فشل في جلب تفاصيل المشروع');
      }
    });
  }

  closeForm(): void {
    this.isFormView.set(false);
    this.isEditMode.set(false);
  }

  // ============== دوال الـ Cover Cropper (خطوتين زي فيسبوك: قص ثم تأكيد) ==============

  fileChangeEvent(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;
    this.selectedCoverFile = file;
    this.tempCroppedBlob = null;
    this.tempCroppedPreview = null;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.objectUrl) {
      this.tempCroppedPreview = event.objectUrl;
    }
    if (event.blob) {
      this.tempCroppedBlob = event.blob;
    }
  }

  loadImageFailed(): void {
    console.error('Failed to load image for cropping');
    this.toast.error('Failed to load the selected image', 'فشل في تحميل الصورة المختارة');
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // ✅ منع الـ infinite loop لو الـ placeholder نفسه مش موجود
    img.onerror = null;
    img.src = 'assets/images/default-placeholder.png';
  }

  confirmCoverCrop(): void {
    if (this.tempCroppedBlob) {
      const fileName = this.selectedCoverFile?.name || 'cover.jpg';
      this.croppedImageFile = new File([this.tempCroppedBlob], fileName, { type: 'image/jpeg' });
      this.croppedImagePreview = this.tempCroppedPreview;
    }
    this.imageChangedEvent = '';
    this.tempCroppedBlob = null;
    this.tempCroppedPreview = null;
  }

  cancelCoverCrop(): void {
    this.imageChangedEvent = '';
    this.tempCroppedBlob = null;
    this.tempCroppedPreview = null;

    if (!this.croppedImageFile) {
      // ✅ استخدام resolveImageUrl بدل تركيب baseUrl مباشرة
      this.croppedImagePreview = this.resolveImageUrl(this.currentCoverUrl);
    }
  }

  // ============== دوال المعرض (Gallery) ==============

  onGallerySelected(event: any): void {
    const files: File[] = Array.from(event.target?.files || []);
    if (!files.length) return;

    files.forEach(file => {
      this.selectedGalleryFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => this.galleryPreviews.push(reader.result as string);
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  removeNewGalleryImage(index: number): void {
    this.selectedGalleryFiles.splice(index, 1);
    this.galleryPreviews.splice(index, 1);
  }

  removeExistingGalleryImage(img: any, index: number): void {
    const id = img?.id ?? img;
    if (id) {
      this.imagesToDelete.push(id);
    }
    this.existingGalleryImages.splice(index, 1);
  }

  // ============== Submit ==============

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields', 'من فضلك اكمل الحقول المطلوبة');
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', this.projectForm.get('categoryId')?.value);
    formData.append('clientName', this.projectForm.get('clientName')?.value);

    // ✅ الحقول الأربعة بدل title/description القديمة
    formData.append('titleEn', this.projectForm.get('titleEn')?.value);
    formData.append('descriptionEn', this.projectForm.get('descriptionEn')?.value || '');
    formData.append('titleAr', this.projectForm.get('titleAr')?.value);
    formData.append('descriptionAr', this.projectForm.get('descriptionAr')?.value || '');

    // ✅ الحقول الجديدة - Location + Completion Month/Year
    const location = this.projectForm.get('location')?.value;
    if (location) {
      formData.append('location', location);
    }

    const completionMonth = this.projectForm.get('completionMonth')?.value;
    const completionYear = this.projectForm.get('completionYear')?.value;

    if (completionMonth) {
      formData.append('completionMonth', completionMonth.toString());
    }
    if (completionYear) {
      formData.append('completionYear', completionYear.toString());
    }

    if (this.croppedImageFile) {
      formData.append('coverImage', this.croppedImageFile);
    }

    if (this.selectedGalleryFiles && this.selectedGalleryFiles.length > 0) {
      this.selectedGalleryFiles.forEach((file) => {
        formData.append('galleryImages', file);
      });
    }

    // ✅ مهم: الاسم لازم يطابق بالظبط property الباك اند (UpdateProjectRequest.DeletedGalleryImages)
    // وإلا الـ Model Binding مش هيلاقي القيمة، والصور المحذوفة هترجع تاني بعد أي تعديل لاحق.
    if (this.imagesToDelete && this.imagesToDelete.length > 0) {
      this.imagesToDelete.forEach((id) => {
        formData.append('DeletedGalleryImages', id.toString());
      });
    }

    this.isLoading.set(true);
    const editing = this.isEditMode();
    const toastId = this.toast.loading(
      editing ? 'Updating project...' : 'Creating project...',
      editing ? 'جاري تحديث المشروع...' : 'جاري إنشاء المشروع...'
    );

    if (editing && this.projectId) {
      this.projectService.updateProject(this.projectId, formData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.resolve(toastId, 'Project updated successfully', 'تم تحديث المشروع بنجاح');
          this.closeForm();
          this.loadProjects(this.currentPage());
        },
        error: (err: any) => {
          console.error('Update Project Error Details:', err);
          this.isLoading.set(false);
          this.errorMessage.set(this.site.t('Failed to update project.', 'فشل في تحديث المشروع.'));
          this.toast.fail(toastId, 'Failed to update project', 'فشل في تحديث المشروع');
        }
      });
    } else {
      this.projectService.createProject(formData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.resolve(toastId, 'Project created successfully', 'تم إنشاء المشروع بنجاح');
          this.closeForm();
          this.loadProjects(1);
        },
        error: (err: any) => {
          console.error('Create Project Error Details:', err);
          this.isLoading.set(false);
          this.errorMessage.set(this.site.t('Failed to create project.', 'فشل في إنشاء المشروع.'));
          this.toast.fail(toastId, 'Failed to create project', 'فشل في إنشاء المشروع');
        }
      });
    }
  }

  deleteItem(id?: number): void {
    if (!id) return;

    const toastId = this.toast.loading(
      'Deleting project...',
      'جاري حذف المشروع...'
    );

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.toast.resolve(
          toastId,
          'Project deleted successfully',
          'تم حذف المشروع بنجاح'
        );

        const isLastItemOnPage = this.projects().length === 1 && this.currentPage() > 1;
        this.loadProjects(isLastItemOnPage ? this.currentPage() - 1 : this.currentPage());
      },
      error: (err: any) => {
        console.error(err);
        this.toast.fail(
          toastId,
          'Failed to delete project',
          'فشل في حذف المشروع'
        );
      }
    });
  }

  getProjectTitle(project: Project): string {
    const currentLang = this.site.currentLang();
    const translation = project.translations?.find(
      t => t.languageCode.toLowerCase() === currentLang.toLowerCase()
    );
    return translation ? translation.title : (project.translations?.[0]?.title || project.title || 'Untitled');
  }
}
