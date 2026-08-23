import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../core/services/app.service';
import { ProjectService } from '../../../core/services/project.service';
import { environment } from '../../../../environments/environment';

export interface SpecItem {
  icon: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

export interface ServiceDetail {
  slug: string;
  categoryId: number; // 🔗 الـ ID الحقيقي من جدول الـ Categories
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  hero_img: string;
  overview_en: string;
  overview_ar: string;
  specs: SpecItem[];
  gallery: string[];
}

export interface FeaturedProject {
  id: number;
  title: string;
  image: string;
  categoryName: string;
}

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  currentSlug: string = '';
  serviceData?: ServiceDetail;

  featuredProjects: FeaturedProject[] = [];
  loadingProjects = true;

  // 🔹 قاموس البيانات التسويقية الثابتة للـ 8 خدمات، مرتبة ومربوطة بالـ Category IDs الحقيقية (1 -> 8)
  servicesDictionary: Record<string, ServiceDetail> = {

    // 01 / 08 - BOOTH FABRICATION -> Booths (id: 1)
    'booth-fabrication': {
      slug: 'booth-fabrication',
      categoryId: 1,
      title_en: 'Booth Fabrication',
      title_ar: 'تصنيع البوثات وأجنحة العرض',
      subtitle_en: 'Modular and custom booths built in-house.',
      subtitle_ar: 'تصنيع محلي في مصانعنا للبوثات الخشبية والألومنيوم والبوثات التفاعلية.',
      hero_img: 'assets/project-booth-1.jpg',
      overview_en: 'Our fully-equipped CNC and carpentry workshops fabricate custom display booths, promotional kiosks, and modular exhibition stands. We ensure precise craftsmanship, seamless paint finishes, and rapid assembly.',
      overview_ar: 'من خلال ورشنا ومصانعنا المجهزة بأحدث ماكينات الـ CNC والنجارة، نقوم بتصنيع البوثات والمنصات الترويجية والستاندات المعيارية بتقفيل عالي الجودة وسرعة تجميع استثنائية.',
      specs: [
        { icon: '⚙️', title_en: 'In-House CNC Fabrication', title_ar: 'قص وتقفيل CNC', desc_en: 'Precision wood, acrylic, and metal cutting.', desc_ar: 'قص وتقطيع ديجيتال للأخشاب والأكريليك والمعادن.' },
        { icon: '🎨', title_en: 'Duco & PU Spray Paint', title_ar: 'دهانات دوكو ودوكو فرن', desc_en: 'Flawless smooth paint surface options.', desc_ar: 'تشطيبات دهان احترافية بألوان الهوية البصرية.' },
        { icon: '💡', title_en: 'Embedded LED Strips', title_ar: 'إضاءة مخفية مدمجة', desc_en: 'Integrated backlighting and showcase lights.', desc_ar: 'دمج شبكات الإضاءة والـ LED داخل مجسمات البوث.' },
        { icon: '📦', title_en: 'Flat-Pack Transport', title_ar: 'سهولة النقل والتفكيك', desc_en: 'Engineered for easy setup and teardown.', desc_ar: 'تصميم موديولار يسهل الشحن والتركيب وإعادة الاستخدام.' }
      ],
      gallery: ['assets/project-booth-1.jpg', 'assets/project-signage.jpg']
    },

    // 02 / 08 - EXHIBITION DESIGN & BUILD -> Exhibitions (id: 2)
    'exhibition-design-build': {
      slug: 'exhibition-design-build',
      categoryId: 2,
      title_en: 'Exhibition Design & Build',
      title_ar: 'تصميم وتنفيذ جناح المعارض',
      subtitle_en: 'From strategy to install — 12m to 900 sqm exhibits.',
      subtitle_ar: 'حلول متكاملة للتصميم المعماري، تخطيط المساحات، وتنفيذ أجنحة المعارض من 12 حتى 900 متر مربع.',
      hero_img: 'assets/project-exhibition-1.jpg',
      overview_en: 'Star Media delivers architectural exhibition stands that turn heads. We handle everything from 3D spatial planning, structural calculations, venue safety compliance, electrical layout, to final handover on the exhibition floor.',
      overview_ar: 'نحن في ستار ميديا نقوم بتصميم وبناء أجنحة المعارض والمؤتمرات بأعلى معايير الجودة والتصميم المعماري. نتولى كافة المراحل: من التخطيط ثلاثي الأبعاد 3D، الاعتماد الهندسي والسلامة، وتجهيز الكابلات والفرش، حتى التسليم النهائي في أرض المعارض.',
      specs: [
        { icon: '🏛️', title_en: 'Custom Wooden Architecture', title_ar: 'هياكل خشبية ديكورية', desc_en: 'Double-decker and custom painted builds.', desc_ar: 'أجنحة دورين ودهانات فاخرة بتصاميم مميزة.' },
        { icon: '📐', title_en: '3D Spatial CAD', title_ar: 'تصميم 3D عالي الدقة', desc_en: 'Photorealistic renders before construction.', desc_ar: 'معاينة الجناح بخاماته وإضاءته قبل التنفيذ.' },
        { icon: '⚡', title_en: 'Power & Cable Management', title_ar: 'شبكات الكهرباء والإضاءة', desc_en: 'Certified distribution for heavy loads.', desc_ar: 'توزيع وتوصيل كهرباء معتمد من أرض المعارض.' },
        { icon: '📋', title_en: 'Venue Permits', title_ar: 'تراخيص المعارض', desc_en: 'Full handling of organizer approvals.', desc_ar: 'استخراج كافة تراخيص البناء والسلامة المعتمدة.' }
      ],
      gallery: ['assets/project-exhibition-1.jpg', 'assets/project-booth-1.jpg']
    },

    // 03 / 08 - EVENTS, ACTIVATIONS, USHERS & SECURITY -> Events (id: 3)
    'events-activations': {
      slug: 'events-activations',
      categoryId: 3,
      title_en: 'Events, Activations, Ushers & Security',
      title_ar: 'تنظيم الفعاليات، التفعيل، والضيافة والحراسة',
      subtitle_en: 'Turnkey production for galas, launches, roadshows + Trained Ushers & Security Guards.',
      subtitle_ar: 'تجهيز الفعاليات بالكامل، منصات التفعيل التفاعلية، طاقم تنظيم وضيافة (Ushering)، وأطقم أمن وحراسة (Guards).',
      hero_img: 'assets/project-event.jpg',
      overview_en: 'Star Media provides 360-degree event production: stage build, audio-visual systems, interactive activation zones, along with elite Ushering & Hostess teams for registration and VIP assistance, and dedicated Security Guards for crowd management.',
      overview_ar: 'نقدم منظومة كاملة للفعاليات والمؤتمرات: بداية من تجهيز المسارح والشاشات والصوتيات، إلى تصميم منصات التفعيل (Activations). كما نوفر أطقم المنظمين والمضيفين (Ushering) بالزي الموحد، وأفراد أمن وحراسة (Guards) لتأمين المداخل وتنظيم الحشود.',
      specs: [
        { icon: '👩‍💼', title_en: 'Ushering & Registration Staff', title_ar: 'طاقم التنظيم والـ Ushering', desc_en: 'Multilingual receptionists, hosts, and badge staff.', desc_ar: 'مضيفين ومضيفات متعددي اللغات لاستقبال الحضور وطباعة البادجات.' },
        { icon: '🛡️', title_en: 'Security Guards & Crowd Control', title_ar: 'أطقم الأمن والحراسة Guards', desc_en: 'Uniformed security staff for VIP entry and safety.', desc_ar: 'فرق أمن وحراسة بزي موحد لتنظيم المداخل وتأمين VIP والحشود.' },
        { icon: '🚀', title_en: 'Interactive Brand Activations', title_ar: 'حملات التفعيل Brand Activations', desc_en: 'Engaging booths, photo mechanics, and games.', desc_ar: 'منصات تفاعلية، ألعاب الكترونية، وشاشات لمس تجذب الجمهور.' },
        { icon: '🎭', title_en: 'Stage, AV & Truss Rigs', title_ar: 'المسرح والأنظمة الصوتية', desc_en: 'Pro LED walls, sound systems, and theatrical lighting.', desc_ar: 'بناء مسارح وشاشات عرض LED وإضاءة سينمائية.' }
      ],
      gallery: ['assets/project-event.jpg', 'assets/project-booth-1.jpg']
    },

    // 04 / 08 - CAR BRANDING & FLEET WRAPS -> Car Branding (id: 4)
    'car-branding': {
      slug: 'car-branding',
      categoryId: 4,
      title_en: 'Car Branding & Fleet Wraps',
      title_ar: 'تغليف السيارات وأساطيل الشركات',
      subtitle_en: 'Full and partial vehicle wraps at fleet scale.',
      subtitle_ar: 'تغليف كامل وجزئي لسيارات وأساطيل الشركات بأعلى خامات الفينيل.',
      hero_img: 'assets/project-car-branding.jpg',
      overview_en: 'Transform commercial vehicles into mobile advertising assets. Using premium German cast vinyl with scratch-resistant clear lamination, we execute complete fleet branding without damaging factory paint.',
      overview_ar: 'حول أسطول سياراتك إلى وسيلة إعلانية متحركة 24/7. نستخدم أحدث خامات الفينيل الألمانية المقاومة للخدش لتغليف السيارات والباصات والشاحنات بالكامل أو جزئياً مع حماية صاج وطلاء السيارة الأصلي.',
      specs: [
        { icon: '🚗', title_en: 'Fleet Cast Vinyl Wraps', title_ar: 'تغليف أساطيل المركبات', desc_en: 'Full wrap, partial wrap, or cut vinyl contouring.', desc_ar: 'تغليف كامل، جزئي، أو استيكرات مقصوصة بالبلاوتر.' },
        { icon: '🛡️', title_en: 'Original Paint Protection', title_ar: 'حماية الطلاء الأصلي', desc_en: 'Non-damaging adhesive formula upon removal.', desc_ar: 'تحمي دهان السيارة الأصلي ولا تترك أي آثار صمغ عند الإزالة.' },
        { icon: '👁️', title_en: 'One-Way Vision Glass', title_ar: 'فينيل رؤية واحدة للزجاج', desc_en: 'Perforated graphics for rear and side windows.', desc_ar: 'فينيل مخرم لزجاج السيارات يسمح بالرؤية الشفافة من الداخل.' },
        { icon: '📜', title_en: '3-Year Warranty', title_ar: 'ضمان 3 سنوات ضد التقشير', desc_en: 'Guaranteed resistance to sun heat and peeling.', desc_ar: 'ضمان شامل ضد الفقاعات والتقشير وتغير الألوان.' }
      ],
      gallery: ['assets/project-car-branding.jpg']
    },

    // 05 / 08 - BRANDING & SIGNAGE -> Signage (id: 5)
    'branding-signage': {
      slug: 'branding-signage',
      categoryId: 5,
      title_en: 'Branding & Signage',
      title_ar: 'الهوية البصرية واللافتات الإعلانية',
      subtitle_en: '3D letters, backlit facades, wayfinding systems.',
      subtitle_ar: 'حروف مضيئة ثلاثية الأبعاد، واجهات ليد، وأنظمة إرشادية وتوجيهية متكاملة.',
      hero_img: 'assets/project-signage.jpg',
      overview_en: 'We craft high-end architectural signage and visual identities. From stainless steel 3D letters, neon flex, backlit LED claddings to indoor wayfinding signage and full brand guidelines.',
      overview_ar: 'نحن متخصصون في تصنيع اليافطات المعمارية وتطبيق الهوية البصرية: تشمل الحروف المضيئة الاستانلس والأكريليك، واجهات الكلادينج والمفروشات الإعلانية، واللوحات الإرشادية الداخلية للشركات والمستشفيات.',
      specs: [
        { icon: '✨', title_en: '3D Illuminated Letters', title_ar: 'حروف 3D مضيئة', desc_en: 'Acrylic, stainless steel, and brass letters.', desc_ar: 'حروف استانلس، أكريليك، ونحاس بارزة بإضاءة ليد interior.' },
        { icon: '🏢', title_en: 'Alucobond Facades', title_ar: 'واجهات كلادينج', desc_en: 'Aluminum composite panel installations.', desc_ar: 'تكسية واجهات المباني والمحلات بالكلادينج المضمون.' },
        { icon: '🧭', title_en: 'Wayfinding Systems', title_ar: 'الأنظمة الإرشادية والتوجيهية', desc_en: 'Modular directional signage for facilities.', desc_ar: 'لوحات توجيهية داخلية للمباني الإدارية والمستشفيات.' },
        { icon: '🎨', title_en: 'Brand Guidelines', title_ar: 'دليل الهوية البصرية', desc_en: 'Vector logo design and brand identity manuals.', desc_ar: 'تصميم وتوثيق دليل استخدام الهوية والشعار.' }
      ],
      gallery: ['assets/project-signage.jpg']
    },

    // 06 / 08 - INDOOR & OUTDOOR PRINTING -> Printing (id: 6)
    'indoor-outdoor-printing': {
      slug: 'indoor-outdoor-printing',
      categoryId: 6,
      title_en: 'Indoor & Outdoor Printing',
      title_ar: 'الطباعة الداخلية والخارجية',
      subtitle_en: 'Wide-format UV, eco-solvent and premium finishing.',
      subtitle_ar: 'طباعة كبيرة الحجم وتقنيات UV وإيكو-سولفنت مع تقفيل صناعي متكامل.',
      hero_img: 'assets/project-printing.jpg',
      overview_en: 'Using high-speed European and Japanese wide-format UV flatbed and roll-to-roll printers, Star Media produces vibrant prints with 1440 DPI accuracy on banner, flex, vinyl, backlights, and rigid materials.',
      overview_ar: 'باستخدام أحدث ماكينات الطباعة اليابانية والأوروبية بأسلوب UV وEco-Solvent، نضمن لك طباعة حادة التفاصيل على الفليكس، البنرات، الاستيكرات، وأكريليك بـ مطابقة تامة لألوان الهوية البصرية.',
      specs: [
        { icon: '🖨️', title_en: 'UV & Eco-Solvent Tech', title_ar: 'تقنيات الطباعة', desc_en: 'Up to 5 meters seamless roll-to-roll.', desc_ar: 'طباعة عريضة بدقة 1440 DPI حتى 5 أمتار بدون وصلات.' },
        { icon: '☀️', title_en: 'Weather Guarantee', title_ar: 'مقاومة للشمس والعوامل الجوية', desc_en: '3-5 years color fade warranty.', desc_ar: 'ضمان ثبات الألوان من 3 إلى 5 سنوات في الإعلانات الخارجية.' },
        { icon: '🎨', title_en: 'Pantone Color Accuracy', title_ar: 'مطابقة الألوان', desc_en: 'Exact CMYK+White ink reproduction.', desc_ar: 'مطابقة أكواد بنتون وطباعة بالحبر الأبيض للأكريليك والزجاج.' },
        { icon: '✂️', title_en: 'Automated Finishing', title_ar: 'التقفيل الرقمي', desc_en: 'Hemming, eyeletting, and lamination.', desc_ar: 'لحام إلكتروني، كبسولات تثبيت، وسلوفان حماية شفاف.' }
      ],
      gallery: ['assets/project-printing.jpg', 'assets/project-booth-1.jpg']
    },

    // 07 / 08 - CUSTOM STANDS -> Custom Stands (id: 7)
    'custom-stands': {
      slug: 'custom-stands',
      categoryId: 7,
      title_en: 'Custom Stands',
      title_ar: 'ستاندات مخصصة',
      subtitle_en: 'Bespoke display stands tailored to your brand and space.',
      subtitle_ar: 'ستاندات عرض مصممة خصيصًا لهويتك ومساحتك.',
      hero_img: 'assets/project-booth-1.jpg',
      overview_en: 'We design and fabricate bespoke standalone display stands for retail, corporate lobbies, and promotional campaigns — combining structural durability with brand-accurate finishing.',
      overview_ar: 'نصمم وننفذ ستاندات عرض مستقلة مخصصة للمتاجر، لوبيهات الشركات، والحملات الترويجية — بمتانة إنشائية ودقة تنفيذ تطابق هويتك البصرية.',
      specs: [
        { icon: '📏', title_en: 'Custom Sizing', title_ar: 'مقاسات مخصصة', desc_en: 'Built to fit any retail or lobby footprint.', desc_ar: 'تصنيع بمقاسات تناسب أي مساحة عرض أو استقبال.' },
        { icon: '🪵', title_en: 'Premium Materials', title_ar: 'خامات فاخرة', desc_en: 'Wood, acrylic, and metal finishing options.', desc_ar: 'خشب، أكريليك، ومعادن بتشطيبات احترافية.' },
        { icon: '🔧', title_en: 'Quick Assembly', title_ar: 'تركيب سريع', desc_en: 'Modular design for fast on-site setup.', desc_ar: 'تصميم موديولار لتركيب سريع في الموقع.' },
        { icon: '🎯', title_en: 'Brand-Accurate Finish', title_ar: 'تطابق دقيق مع الهوية', desc_en: 'Color and material matching to brand guidelines.', desc_ar: 'مطابقة الألوان والخامات لدليل الهوية البصرية.' }
      ],
      gallery: ['assets/project-booth-1.jpg', 'assets/project-signage.jpg']
    },

    // 08 / 08 - GIVEAWAYS -> Giveaways (id: 8)
    'giveaways': {
      slug: 'giveaways',
      categoryId: 8,
      title_en: 'Giveaways',
      title_ar: 'الهدايا الترويجية',
      subtitle_en: 'Branded merchandise and promotional items at scale.',
      subtitle_ar: 'منتجات ترويجية مطبوعة بهويتك بأي كمية.',
      hero_img: 'assets/project-printing.jpg',
      overview_en: 'From corporate gifting to mass-scale event giveaways, we produce branded merchandise with consistent quality and fast turnaround — pens, apparel, drinkware, and custom promotional items.',
      overview_ar: 'من الهدايا المؤسسية للشركات إلى هدايا الفعاليات بكميات كبيرة، ننتج منتجات ترويجية بهويتك بجودة ثابتة وسرعة تسليم — أقلام، ملابس، أكواب، ومنتجات ترويجية مخصصة.',
      specs: [
        { icon: '🎁', title_en: 'Bulk Production', title_ar: 'إنتاج بكميات كبيرة', desc_en: 'Scalable output for large event distributions.', desc_ar: 'إنتاج بكميات كبيرة لتوزيعات الفعاليات الضخمة.' },
        { icon: '🖊️', title_en: 'Wide Product Range', title_ar: 'تشكيلة منتجات واسعة', desc_en: 'Pens, bags, drinkware, apparel, and more.', desc_ar: 'أقلام، شنط، أكواب، ملابس، وأكثر.' },
        { icon: '🎨', title_en: 'Custom Branding', title_ar: 'طباعة الهوية', desc_en: 'Logo printing, embroidery, and engraving.', desc_ar: 'طباعة الشعار، تطريز، وحفر ليزر.' },
        { icon: '⏱️', title_en: 'Fast Turnaround', title_ar: 'تسليم سريع', desc_en: 'Quick production for time-sensitive events.', desc_ar: 'إنتاج سريع للفعاليات ذات المواعيد الضيقة.' }
      ],
      gallery: ['assets/project-printing.jpg', 'assets/project-event.jpg']
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    public site: AppService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentSlug = params.get('slug') || '';
      this.loadDataForSlug(this.currentSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  loadDataForSlug(slug: string): void {
    if (this.servicesDictionary[slug]) {
      this.serviceData = this.servicesDictionary[slug];
    } else {
      // Fallback لأول خدمة لو الـ slug مش موجود
      this.serviceData = Object.values(this.servicesDictionary)[0];
    }

    if (this.serviceData) {
      this.loadFeaturedProjects(this.serviceData.categoryId);
    }
  }

  private loadFeaturedProjects(categoryId: number): void {
    this.loadingProjects = true;
    this.featuredProjects = [];

    // بناء رابط السيرفر الأساسي مرة واحدة (بدون /api في الآخر) عشان نلزقه قبل مسارات الصور النسبية
    const baseUrl = environment.apiUrl.endsWith('/')
      ? environment.apiUrl.slice(0, -1)
      : environment.apiUrl;
    const baseServerUrl = baseUrl.replace(/\/api$/, '');

    // ✅ أول 3 مشاريع بس، مفلترة بالـ categoryId الحقيقي
    this.projectService.getAllProjects(1, 3, undefined, categoryId, true).subscribe({
      next: (res: any) => {
        const rawProjects = res.data?.items || res.items || res.data || res || [];

        this.featuredProjects = rawProjects.map((p: any) => {
          // 1) بناء رابط الصورة الكامل (نفس منطق portfolio.component.ts)
          let imageUrl = p.coverImage || '';
          if (imageUrl && !imageUrl.startsWith('http')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
            imageUrl = baseServerUrl + cleanPath;
          }

          // 2) اسم الـ Category بدل تكرار اسم العميل تحت العنوان
          //    ⚠️ الحقول دي تخمين مبدئي — لسه محتاجين نتأكد من شكل الـ response الفعلي من الـ API
          const categoryName = this.site.lang() === 'ar'
            ? (p.category?.name_ar || p.categoryAr || p.category?.name || '')
            : (p.category?.name_en || p.categoryEn || p.category?.name || '');

          return {
            id: p.id,
            title: p.title || p.clientName || 'Project #' + p.id,
            image: imageUrl || 'assets/placeholder.jpg',
            categoryName: categoryName
          };
        });

        this.loadingProjects = false;
      },
      error: () => {
        this.featuredProjects = [];
        this.loadingProjects = false;
      }
    });
  }

  // زرار See More -> يودي على Portfolio مفلتر بنفس الـ categoryId
  goToFilteredPortfolio(): void {
    if (!this.serviceData) return;
    this.router.navigate(['/portfolio'], {
      queryParams: { categoryId: this.serviceData.categoryId }
    });
  }
}
