import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AppService } from '../../../core/services/app.service';
import { ProjectService } from '../../../core/services/project.service';
import { CategoryService } from '../../../core/services/Category.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  loading = false;
  gallery: string[] = [];

  // 🔗 نخزن البيانات الخام (raw) من الـ API زي ما هي، بكل الترجمات جواها.
  // العنوان والوصف بيتحسبوا لايف من الـ getters تحت، مش مرة واحدة عند التحميل،
  // عشان لو اللغة اتغيرت وإحنا لسه واقفين في نفس الصفحة، النص يتبدل فورًا.
  private rawProject: any = null;
  private rawRelatedItems: any[] = [];

  // 🔗 قائمة الكاتيجوريز بالإنجليزي، نفس منطق portfolio/home، عشان نطابق بيها اسم كاتيجوري المشروع
  private categories: any[] = [];

  private sub?: Subscription;
  private baseServerUrl: string;

  // ✅ أسماء الشهور بالعربي والإنجليزي - عشان عرض تاريخ التنفيذ يتبدل حسب اللغة
  private readonly monthNames: Record<number, { en: string; ar: string }> = {
    1: { en: 'January', ar: 'يناير' },
    2: { en: 'February', ar: 'فبراير' },
    3: { en: 'March', ar: 'مارس' },
    4: { en: 'April', ar: 'أبريل' },
    5: { en: 'May', ar: 'مايو' },
    6: { en: 'June', ar: 'يونيو' },
    7: { en: 'July', ar: 'يوليو' },
    8: { en: 'August', ar: 'أغسطس' },
    9: { en: 'September', ar: 'سبتمبر' },
    10: { en: 'October', ar: 'أكتوبر' },
    11: { en: 'November', ar: 'نوفمبر' },
    12: { en: 'December', ar: 'ديسمبر' },
  };

  constructor(
    public site: AppService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private categoryService: CategoryService
  ) {
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    this.baseServerUrl = baseUrl.replace(/\/api$/, '');
  }

  ngOnInit(): void {
    this.loadCategories();

    this.sub = this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = Number(params.get('id'));
          this.loading = true;
          this.rawProject = null;
          this.rawRelatedItems = [];
          this.gallery = [];

          if (!id) {
            this.loading = false;
            return of(null);
          }

          return this.projectService.getProjectById(id).pipe(
            catchError(() => {
              this.loading = false;
              return of(null);
            })
          );
        })
      )
      .subscribe((res: any) => {
        this.loading = false;
        if (!res) return;

        this.rawProject = res.data || res;
        this.gallery = this.mapGallery(this.rawProject);

        if (this.rawProject.categoryId) {
          this.loadRelated(this.rawProject.categoryId, this.rawProject.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ============== Categories ==============
  // 🔗 بنحتفظ بالكاتيجوريز الخام (raw) بكل ترجماتها، عشان نقدر نطلع منها:
  // 1) اسم إنجليزي "داخلي" ثابت للمطابقة مع serviceScopeMap (متعمّد يفضل إنجليزي)
  // 2) اسم "معروض" للمستخدم يتبدل حسب لغة الموقع الحالية

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || res;
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  private resolveCategoryTranslatedName(match: any, lang: string, fallback: string): string {
    if (!match) return fallback;

    if (lang.toUpperCase() === 'EN') {
      return (
        match.nameEn ||
        match.name_en ||
        match.englishName ||
        match.EnglishName ||
        match.translations?.find((t: any) => t.languageCode?.toUpperCase() === 'EN')?.name ||
        match.translations?.[0]?.name ||
        match.name ||
        fallback
      );
    }

    return (
      match.translations?.find((t: any) => t.languageCode?.toUpperCase() === lang.toUpperCase())?.name ||
      match.name ||
      fallback
    );
  }

  // الاسم الداخلي: دايمًا إنجليزي، بيستخدم بس للمطابقة مع serviceScopeMap - مش بيتعرض للمستخدم
  private resolveCategoryKey(categoryId: number | null, fallback: string): string {
    if (!categoryId) return fallback;
    const match = this.categories.find((c: any) => c.id === categoryId);
    return this.resolveCategoryTranslatedName(match, 'EN', fallback);
  }

  // الاسم المعروض: بيتبدل حسب لغة الموقع الحالية
  private resolveCategoryDisplayName(categoryId: number | null, fallback: string): string {
    if (!categoryId) return fallback;
    const match = this.categories.find((c: any) => c.id === categoryId);
    const currentLang = this.site.currentLang() || 'en';
    return this.resolveCategoryTranslatedName(match, currentLang, fallback);
  }

  private loadRelated(categoryId: number, currentId: number): void {
    this.projectService
      .getAllProjects(1, 4, undefined, categoryId, true)
      .pipe(catchError(() => of(null)))
      .subscribe((res: any) => {
        if (!res) return;
        const items = res.data?.items || res.items || res.data || res;
        this.rawRelatedItems = items
          .filter((p: any) => p.id !== currentId)
          .slice(0, 3);
      });
  }

  // ============== 🌍 العنوان والوصف: بيتحسبوا لايف حسب لغة الموقع الحالية ==============

  private getTranslation(raw: any): { title: string; description: string } {
    const currentLang = (this.site.currentLang() || 'en').toUpperCase();
    const translations = raw?.translations || [];

    const translation =
      translations.find((t: any) => t.languageCode?.toUpperCase() === currentLang) ||
      translations[0];

    return {
      title: translation?.title || raw?.clientName || ('Project #' + raw?.id),
      description: translation?.description || ''
    };
  }

  // ✅ تاريخ التنفيذ (شهر + سنة) بيتحسب لايف حسب اللغة الحالية.
  // لو مفيش شهر/سنة متسجلين للمشروع، بترجع string فاضي عشان الكارت يقدر يستخبى.
  private getCompletionDateDisplay(raw: any): string {
    const month = raw?.completionMonth;
    const year = raw?.completionYear;

    if (!year) return '';

    const currentLang = this.site.currentLang() === 'ar' ? 'ar' : 'en';

    if (!month) return String(year);

    const monthName = this.monthNames[month]?.[currentLang] || '';
    return monthName ? `${monthName} ${year}` : String(year);
  }

  private mapProject(p: any): any {
    const categoryKey = this.resolveCategoryKey(p.categoryId, p.categoryName || '');
    const categoryDisplay = this.resolveCategoryDisplayName(p.categoryId, categoryKey);
    const t = this.getTranslation(p);

    return {
      id: p.id,
      title: t.title,
      image: this.resolveImage(p.coverImage),
      client: p.clientName || '',
      category: categoryDisplay,      // ✅ ده اللي بيتعرض للمستخدم - بيتبدل حسب اللغة
      categoryKey: categoryKey,       // 🔒 ده بس للمطابقة الداخلية مع serviceScopeMap - إنجليزي ثابت
      year: p.year || p.completionYear || '',
      summary: t.description,

      // ✅ الحقول الجديدة
      location: p.location || '',
      completionDate: this.getCompletionDateDisplay(p),  // مثال: "May 2026" أو "مايو 2026"
    };
  }

  // ✅ الـ getter ده بيتنفذ في كل مرة الـ template بيقرأ project.* — يعني أي تغيير في اللغة
  // بيترجم فورًا في العنوان والوصف من غير ما نحتاج نعمل reload أو refetch.
  get project(): any {
    if (!this.rawProject) return undefined;
    return this.mapProject(this.rawProject);
  }

  get related(): any[] {
    return this.rawRelatedItems.map((p: any) => this.mapProject(p));
  }

  private resolveImage(path: string): string {
    if (!path) return 'assets/images/default-placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return this.baseServerUrl + cleanPath;
  }

  private mapGallery(raw: any): string[] {
    const images = raw.galleryImages || raw.gallery || raw.images;
    if (Array.isArray(images) && images.length > 0) {
      return images.map((g: any) => this.resolveImage(g.imageUrl || g.url || g));
    }
    return this.project ? [this.project.image] : [];
  }

  get breakdown() {
    return [
      {
        k: this.site.t('Challenge', 'التحدي'),
        v: this.site.t(
          'Create a distinctive production experience that reflects the client’s brand while meeting tight deadlines and maintaining premium quality.',
          'تنفيذ تجربة إنتاج احترافية تعكس هوية العميل مع الالتزام بالوقت وأعلى معايير الجودة.'
        )
      },
      {
        k: this.site.t('Solution', 'الحل'),
        v: this.site.t(
          'Our creative, production and installation teams collaborated from concept to final execution using Star Media’s in-house facilities.',
          'عمل فريق التصميم والإنتاج والتركيب معًا منذ الفكرة وحتى التنفيذ الكامل داخل مصانع وإمكانيات Star Media.'
        )
      },
      {
        k: this.site.t('Result', 'النتيجة'),
        v: this.site.t(
          'The project was delivered on schedule with exceptional finishing quality, creating a strong visual impact and a memorable brand experience.',
          'تم تسليم المشروع في الموعد المحدد بجودة تنفيذ عالية، مما ساهم في إبراز العلامة التجارية وخلق تجربة مميزة للجمهور.'
        )
      }
    ];
  }

  selectedImage: string | null = null;
  selectedIndex = 0;

  openLightbox(index: number): void {
    this.selectedIndex = index;
    this.selectedImage = this.gallery[index];
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    this.selectedIndex = (this.selectedIndex + 1) % this.gallery.length;
    this.selectedImage = this.gallery[this.selectedIndex];
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    this.selectedIndex = (this.selectedIndex - 1 + this.gallery.length) % this.gallery.length;
    this.selectedImage = this.gallery[this.selectedIndex];
  }
}
