import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../core/services/app.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { Category} from '../../../shared/interfaces/Category.model';
import { ConfirmDialogService } from '../../../shared/Confirm/confirm-dialog.service';
import { CategoryService } from '../../../core/services/Category.service';

ConfirmDialogService
CategoryService

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  isSaving = false;
  isModalOpen = false;
  isEditMode = false;
  selectedId: number | null = null;

  categoryForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    public site: AppService,
    private toast: ToastService,
    private confirmDialog: ConfirmDialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      nameAr: ['', [Validators.required, Validators.minLength(2)]],
      nameEn: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
        this.toast.error('Failed to load categories', 'فشل في تحميل الأقسام');
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedId = null;
    this.categoryForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(category: Category): void {
    this.isEditMode = true;
    this.selectedId = category.id || null;

    const arTrans = category.translations?.find(t => t.languageCode.toUpperCase() === 'AR');
    const enTrans = category.translations?.find(t => t.languageCode.toUpperCase() === 'EN');

    this.categoryForm.setValue({
      nameAr: arTrans ? arTrans.name : '',
      nameEn: enTrans ? enTrans.name : ''
    });

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields', 'من فضلك اكمل الحقول المطلوبة');
      return;
    }

    const payload = {
      translations: [
        { languageCode: 'AR', name: this.categoryForm.value.nameAr },
        { languageCode: 'EN', name: this.categoryForm.value.nameEn }
      ]
    };

    this.isSaving = true;
    const toastId = this.toast.loading(
      this.isEditMode ? 'Updating category...' : 'Adding category...',
      this.isEditMode ? 'جاري تحديث القسم...' : 'جاري إضافة القسم...'
    );

    const request$ = this.isEditMode && this.selectedId
      ? this.categoryService.updateCategory(this.selectedId, payload)
      : this.categoryService.createCategory(payload);

    request$.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.resolve(
            toastId,
            this.isEditMode ? 'Category updated successfully' : 'Category added successfully',
            this.isEditMode ? 'تم تحديث القسم بنجاح' : 'تم إضافة القسم بنجاح'
          );
          this.loadCategories();
          this.closeModal();
        } else {
          this.toast.fail(toastId, res.message || 'Something went wrong', res.message || 'حدث خطأ ما');
        }
      },
      error: (err) => {
        console.error('Error saving category:', err);
        this.isSaving = false;
        this.toast.fail(
          toastId,
          this.isEditMode ? 'Failed to update category' : 'Failed to add category',
          this.isEditMode ? 'فشل في تحديث القسم' : 'فشل في إضافة القسم'
        );
      }
    });
  }

deleteCategory(id?: number): void {

  if (!id) return;

  console.log("DELETE START");

  const toastId = this.toast.loading(
    'Deleting...',
    'جاري الحذف...'
  );

  this.categoryService.deleteCategory(id).subscribe({

    next: (res) => {

      console.log("DELETE RESPONSE", res);

      this.toast.resolve(
        toastId,
        'Deleted',
        'تم الحذف'
      );

      this.loadCategories();

    },

    error: err => {

      console.error(err);

      this.toast.fail(
        toastId,
        'Delete failed',
        'فشل الحذف'
      );

    }

  });

}

  getCategoryName(cat: Category, lang: string): string {
    const trans = cat.translations?.find(t => t.languageCode.toUpperCase() === lang.toUpperCase());
    return trans ? trans.name : (cat.translations?.[0]?.name || '');
  }
}
