import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

import { Category } from '../../../shared/interfaces/Category.model';
import { AppService } from '../../../core/services/app.service';
import { ProjectService } from '../../../core/services/project.service';
import { CategoryService } from '../../../core/services/Category.service';
import { environment } from '../../../../environments/environment';
import { effect } from '@angular/core';
const ALL_CATEGORY: Category = { id: 0, name: 'All' } as unknown as Category;

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  categories: Category[] = [ALL_CATEGORY];
  selectedCategory: Category = ALL_CATEGORY;

  projects: any[] = [];
  query = '';
  loading = false;
  error = false;
  filterOpen = false;
  page = 1;
  pageSize = 12;
  totalCount = 0;

  // 🔗 categoryId جاي من صفحة تانية (زي service-details) عن طريق queryParams
  // بنسيبه هنا لحد ما الليستة الحقيقية للكاتيجوريز توصل من الـ API عشان نستبدله بالاسم الصح ونفعّل الهايلايت على التاب الصح
  private pendingCategoryId: number | null = null;

  private searchSubject = new Subject<void>();
  private searchSub?: Subscription;

  constructor(
    public site: AppService,
    private projectService: ProjectService,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {

  effect(() => {
    this.site.currentLang();
    this.loadCategories();
  });

}


  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    // 🔗 اقرأ categoryId من الـ URL (لو جاي من زرار "See More" في صفحة الخدمة)
    const categoryIdParam = this.route.snapshot.queryParamMap.get('categoryId');
    if (categoryIdParam) {
      const catId = Number(categoryIdParam);
      if (!isNaN(catId) && catId !== 0) {
        // كاتيجوري مؤقتة بنفس الـ id الحقيقي، هتتستبدل بالاسم الصح لما الليستة توصل من الـ API
        this.selectedCategory = { id: catId, name: '' } as unknown as Category;
        this.pendingCategoryId = catId;
      }
    }

    this.loadCategories();

    // switchMap بيلغي أي طلب قديم لسه ماردش لو جه طلب جديد (يحل مشكلة البطء والتضارب)
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap(() => {
          this.loading = true;
          this.page = 1;
          return this.projectService
            .getAllProjects(
              this.page,
              this.pageSize,
              this.query || undefined,
              this.selectedCategory.id === 0 ? undefined : this.selectedCategory.id,
              true
            )
            .pipe(
              catchError(() => {
                this.error = true;
                this.loading = false;
                return of(null);
              })
            );
        })
      )
      .subscribe((res: any) => {
        this.processProjectsResponse(res);
      });

    // أول تحميل للصفحة (هيستخدم selectedCategory اللي جاي من الـ URL لو موجود)
    this.fetchProjects();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  private loadCategories(): void {

    this.categoryService.getAllCategories().subscribe({

      next: (res: any) => {

        const categoriesList = res.data || res;

        const currentLang = 'EN'; // 🔒 نفضّل نخزن اسم إنجليزي "افتراضي" جوه c.name، بس العرض الفعلي بيتحدد لايف من getCategoryDisplayName() تحت

        const allCategory: any = {
          id: 0,
          name: 'All',
          translations: [
            {
              languageCode: 'AR',
              name: 'الكل'
            },
            {
              languageCode: 'EN',
              name: 'All'
            }
          ]
        };

        const cats = categoriesList.map((c: any) => {

          const translation = c.translations?.find(
            (t: any) =>
              t.languageCode?.toUpperCase() === currentLang
          );

          // 🔗 بنجرب كل الاحتمالات المعروفة لاسم الحقل الإنجليزي، لحد ما نتأكد من الشكل الفعلي للـ API
          const resolvedName =
            c.nameEn ||
            c.name_en ||
            c.englishName ||
            c.EnglishName ||
            translation?.name ||
            c.translations?.[0]?.name ||
            c.name ||
            '';

          return {
            ...c,        // ✅ بيحافظ على c.translations[] الأصلية جوه الكائن الناتج
            name: resolvedName
          };

        });

        this.categories = [allCategory, ...cats];

        // 🔗 لو فيه categoryId جاي من الـ URL، استبدل الكاتيجوري المؤقتة بالكاتيجوري الحقيقية
        // (كده اسمها هيظهر صح واسمها هيتظبط باللغة الصح، والتاب بتاعها هيتهايلايت في الشريط)
        if (this.pendingCategoryId !== null) {
          const match = this.categories.find(c => c.id === this.pendingCategoryId);
          if (match) {
            this.selectedCategory = match;
          }
          this.pendingCategoryId = null;
        }

      },

      error: () => {

        this.categories = [
          {
            id: 0,
            name: 'All',
            translations: [
              {
                languageCode: 'AR',
                name: 'الكل'
              },
              {
                languageCode: 'EN',
                name: 'All'
              }
            ]
          }
        ];

      }

    });

  }

  // ✅ الاسم المعروض فعليًا للمستخدم — بيتحسب لايف كل مرة الـ template بيناديها،
  // فلو المستخدم بدّل اللغة، النص بيتغير فورًا من غير ما نحتاج نعيد تحميل الكاتيجوريز أو المشاريع.
  getCategoryDisplayName(categoryId: number | null | undefined): string {
    if (categoryId === undefined || categoryId === null || categoryId === 0) {
      return this.site.t('All', 'الكل');
    }

    const match = this.categories.find((c: any) => c.id === categoryId) as any;
    if (!match) return '';

    const lang = (this.site.currentLang() || 'en').toUpperCase();
    if (lang === 'EN') return match.name;

    return (
      match.translations?.find((t: any) => t.languageCode?.toUpperCase() === lang)?.name ||
      match.translations?.[0]?.name ||
      match.name ||
      ''
    );
  }

  private fetchProjects(): void {
    this.loading = true;

    this.projectService
      .getAllProjects(
        this.page,
        this.pageSize,
        this.query || undefined,
        this.selectedCategory.id === 0 ? undefined : this.selectedCategory.id,
        true
      )
      .pipe(
        catchError((err) => {
          console.error('❌ Projects API Error:', err);
          this.error = true;
          this.loading = false;
          return of(null);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.processProjectsResponse(res);
        },

        complete: () => {
          this.loading = false;
        }
      });
  }

  private processProjectsResponse(res: any): void {
    this.loading = false;
    if (!res) return;
    this.error = false;

    const rawProjects = res.data?.items || res.items || res.data || res;
    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const baseServerUrl = baseUrl.replace(/\/api$/, '');

    this.projects = rawProjects.map((p: any) => {
      let imageUrl = p.coverImage || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
        imageUrl = baseServerUrl + cleanPath;
      }

      return {
        id: p.id,
        title: p.title || p.clientName || 'Project #' + p.id,
        image: imageUrl || 'assets/images/default-placeholder.png',
        client: p.clientName || '',
        categoryId: p.categoryId ?? null   // ✅ بنخزن الـ id بس، والاسم بيتحسب لايف في الـ template
      };
    });

    this.totalCount = res.data?.totalCount || res.totalCount || this.projects.length;
  }

  setCategory(c: Category): void {
    if (this.selectedCategory.id === c.id) return;
    this.selectedCategory = c;
    this.searchSubject.next();
  }

  onSearchChange(): void {
    this.searchSubject.next();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this.fetchProjects();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    this.goToPage(this.page + 1);
  }

  prevPage(): void {
    this.goToPage(this.page - 1);
  }
}
