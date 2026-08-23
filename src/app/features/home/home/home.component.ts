import { Component, OnInit } from '@angular/core';

import { CLIENTS, STATS, COMPANY_DETAILS } from '../../../shared/data/site-data';
import { Category } from '../../../shared/interfaces/Category.model';
import { AppService } from '../../../core/services/app.service';
import { ProjectService } from '../../../core/services/project.service';
import { CategoryService } from '../../../core/services/Category.service';
import { environment } from '../../../../environments/environment';

interface ServiceGroup {
  slug: string;
  en: string;
  ar: string;
  img: string;
  desc: string;
  desc_ar: string;
  items: string[];
  itemsAr: string[];
}

interface Faq {
  q_en: string;
  q_ar: string;
  a_en: string;
  a_ar: string;
}

const ALL_CATEGORY: Category = { id: 0, name: 'All' } as unknown as Category;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  stats = STATS;
  clientsMarquee = [...CLIENTS, ...CLIENTS];

  // Animated counter values — one per entry in `stats`, in the same order.
  // Rendered directly in the template ({{ statValues[i] }}) instead of a
  // separate <app-counter> component, so there is nothing extra to wire up.
  statValues: number[] = [];

  serviceGroups = COMPANY_DETAILS.serviceGroups;

  faqs: Faq[] = [

    {
      q_en: 'What services does Star Media offer?',
      q_ar: 'ما الخدمات التي تقدمها ستار ميديا؟',
      a_en: 'Star Media provides complete creative and production solutions, including exhibitions, booth fabrication, indoor and outdoor printing, branding, signage, events, activations, vehicle branding, custom stands and promotional materials.',
      a_ar: 'تقدم ستار ميديا حلولًا متكاملة في الإبداع والإنتاج، تشمل المعارض، تصنيع الأجنحة، الطباعة الداخلية والخارجية، البراندنج، اللافتات، الفعاليات، التفعيلات، براندنج السيارات، الستاندات المخصصة والمواد الدعائية.'
    },

    {
      q_en: 'Do you handle projects from concept to execution?',
      q_ar: 'هل تنفذون المشروع من الفكرة حتى التنفيذ؟',
      a_en: 'Yes. We manage the entire process from creative concept and design to production, fabrication, printing, installation and final on-ground execution.',
      a_ar: 'نعم. ندير المشروع بالكامل بداية من الفكرة والتصميم، مرورًا بالإنتاج والتصنيع والطباعة، وحتى التركيب والتنفيذ النهائي على أرض الواقع.'
    },

    {
      q_en: 'Where is Star Media located?',
      q_ar: 'أين يقع مقر ستار ميديا؟',
      a_en: 'Star Media is based in Cairo, Egypt, with a fully equipped creative and production operation serving clients across different industries.',
      a_ar: 'يقع مقر ستار ميديا في القاهرة، مصر، مع منظومة متكاملة للإبداع والإنتاج تخدم عملاء من مختلف المجالات.'
    },

    {
      q_en: 'Do you work outside Cairo?',
      q_ar: 'هل تعملون خارج القاهرة؟',
      a_en: 'Yes. We execute projects across Cairo and travel to different governorates across Egypt for production, installation, events, activations and on-ground projects.',
      a_ar: 'نعم. ننفذ مشاريع داخل القاهرة ونسافر إلى مختلف محافظات مصر لتنفيذ أعمال الإنتاج والتركيب والفعاليات والتفعيلات والمشاريع على أرض الواقع.'
    },

    {
      q_en: 'Can Star Media build custom booths and exhibition stands?',
      q_ar: 'هل يمكن لستار ميديا تنفيذ أجنحة وستاندات مخصصة؟',
      a_en: 'Absolutely. We design and fabricate custom booths, exhibition stands and brand experiences tailored to your space, objectives and brand identity.',
      a_ar: 'بالتأكيد. نصمم وننفذ أجنحة وستاندات وتجارب براند مخصصة تتناسب مع المساحة والأهداف وهوية علامتك التجارية.'
    },

    {
      q_en: 'Do you provide printing and installation services?',
      q_ar: 'هل تقدمون خدمات الطباعة والتركيب؟',
      a_en: 'Yes. We provide indoor and outdoor printing, large-format graphics, vinyl applications, signage and professional installation as part of our complete production solutions.',
      a_ar: 'نعم. نقدم خدمات الطباعة الداخلية والخارجية، المطبوعات كبيرة الحجم، تطبيقات الفينيل، اللافتات والتركيب الاحترافي ضمن حلولنا الإنتاجية المتكاملة.'
    },

    {
      q_en: 'Do you handle vehicle branding and wrapping?',
      q_ar: 'هل تقدمون خدمات براندنج وتغليف السيارات؟',
      a_en: 'Yes. We provide full and partial vehicle branding, fleet wraps and custom graphics, from design and printing to professional installation.',
      a_ar: 'نعم. نقدم خدمات براندنج السيارات، التغليف الكامل أو الجزئي، وبراندنج الأساطيل، بداية من التصميم والطباعة وحتى التركيب الاحترافي.'
    },

    {
      q_en: 'Can I visit your production facility?',
      q_ar: 'هل يمكنني زيارة مقر أو منشأة الإنتاج؟',
      a_en: 'Yes. You can contact us to arrange a visit, discuss your project and meet the team behind the creative and production process.',
      a_ar: 'نعم. يمكنك التواصل معنا لترتيب زيارة، مناقشة مشروعك والتعرف على الفريق المسؤول عن مراحل الإبداع والإنتاج.'
    },

  ];
  // 🔗 Featured Projects — حقيقية من الـ API (نفس منطق portfolio.component.ts)
  categories: Category[] = [ALL_CATEGORY];
  selectedCategory: Category = ALL_CATEGORY;
  featuredProjects: any[] = [];
  loadingProjects = true;
  projectsError = false;

  openFaqIndex = 0;

  constructor(
    public site: AppService,
    private projectService: ProjectService,
    private categoryService: CategoryService
  ) {}
  equipment = COMPANY_DETAILS.capabilities.equipment;

  ngOnInit(): void {
    // Start every stat at 0, then count each one up to its target value.
    this.statValues = this.stats.map(() => 0);
    this.stats.forEach((s, i) => this.animateStat(i, Number(s.value)));

    this.loadCategories();
    this.loadFeaturedProjects();
  }

  private animateStat(index: number, target: number, duration = 1800): void {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      this.statValues[index] = Math.round(target * eased);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        this.statValues[index] = target;
      }
    };
    requestAnimationFrame(tick);
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res: any) => {
        const categoriesList = res.data || res;
        const currentLang = 'EN'; // 🔒 اسم إنجليزي "افتراضي" يتخزن جوه c.name، والعرض الفعلي بيتحدد لايف من getCategoryDisplayName()

        const allCategory: any = {
          id: 0,
          name: 'All',
          translations: [
            { languageCode: 'AR', name: 'الكل' },
            { languageCode: 'EN', name: 'All' }
          ]
        };

        const cats = categoriesList.map((c: any) => {
          const translation = c.translations?.find(
            (t: any) => t.languageCode?.toUpperCase() === currentLang
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
            ...c,        // ✅ بيحافظ على c.translations[] الأصلية
            name: resolvedName
          };
        });

        this.categories = [allCategory, ...cats];
      },
      error: () => {
        this.categories = [
          {
            id: 0,
            name: 'All',
            translations: [
              { languageCode: 'AR', name: 'الكل' },
              { languageCode: 'EN', name: 'All' }
            ]
          }
        ] as unknown as Category[];
      }
    });
  }

  // ✅ الاسم المعروض فعليًا للمستخدم — بيتحسب لايف كل مرة الـ template بيناديها
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

  private loadFeaturedProjects(): void {
    this.loadingProjects = true;
    this.projectsError = false;

    const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl.slice(0, -1) : environment.apiUrl;
    const baseServerUrl = baseUrl.replace(/\/api$/, '');

    this.projectService
      .getAllProjects(
        1,
        6,
        undefined,
        this.selectedCategory.id === 0 ? undefined : this.selectedCategory.id,
        true
      )
      .subscribe({
        next: (res: any) => {
          const rawProjects = res.data?.items || res.items || res.data || res || [];

          this.featuredProjects = rawProjects.map((p: any) => {
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
              categoryId: p.categoryId ?? null,   // ✅ بنخزن الـ id بس، والاسم بيتحسب لايف في الـ template
              year: p.year || ''
            };
          });

          this.loadingProjects = false;
        },
        error: () => {
          this.featuredProjects = [];
          this.projectsError = true;
          this.loadingProjects = false;
        }
      });
  }

  setCategory(c: Category): void {
    if (this.selectedCategory.id === c.id) return;
    this.selectedCategory = c;
    this.loadFeaturedProjects();
  }

  toggleFaq(i: number): void {
    this.openFaqIndex = this.openFaqIndex === i ? -1 : i;
  }
}
