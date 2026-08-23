import { Project } from '../interfaces/project.model';
import { Stat } from '../interfaces/stats';

// ---------------------------------------------------------------------------
// CATEGORIES & PROJECTS
// ---------------------------------------------------------------------------
export const CATEGORIES = [
  'All',
  'Booths',
  'Exhibitions',
  'Printing',
  'Branding',
  'Events',
  'Signage',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PROJECTS: Project[] = [
  {
    id: 'pandora-booth',
    title: 'Pandora Exhibition Booth',
    client: 'Pandora',
    category: 'Booths',
    year: '2025',
    image: 'assets/project-booth-1.jpg',
    summary:
      'Custom exhibition booth designed, fabricated and installed by Star Media for Pandora.',
  },
  {
    id: 'guess-branding',
    title: 'Guess Branding Production',
    client: 'Guess',
    category: 'Branding',
    year: '2025',
    image: 'assets/project-printing.jpg',
    summary:
      'Complete branding production including printing, fabrication and installation.',
  },
  {
    id: 'citystars-signage',
    title: 'Citystars Signage System',
    client: 'Citystars',
    category: 'Signage',
    year: '2024',
    image: 'assets/project-signage.jpg',
    summary:
      'Indoor and outdoor signage system with premium fabrication and installation.',
  },
  {
    id: 'eva-printing',
    title: 'Eva Cosmetics Printing',
    client: 'Eva Cosmetics',
    category: 'Printing',
    year: '2024',
    image: 'assets/project-printing.jpg',
    summary:
      'Large format printing, POS materials and promotional production.',
  },
  {
    id: 'mcv-event',
    title: 'MCV Brand Activation',
    client: 'MCV',
    category: 'Events',
    year: '2024',
    image: 'assets/project-event.jpg',
    summary:
      'Complete production including branding, giveaways and activation setup.',
  },
  {
    id: 'almajed-exhibition',
    title: 'Almajed Jewellery Exhibition',
    client: 'Almajed Jewellery',
    category: 'Exhibitions',
    year: '2023',
    image: 'assets/project-exhibition-1.jpg',
    summary:
      'Luxury exhibition stand with premium finishing and custom-built display units.',
  }
];

// ---------------------------------------------------------------------------
// CLIENTS (Images / Logos Only Base)
// ---------------------------------------------------------------------------
export interface ClientLogo {
  name: string;
  logoUrl: string;
}

export const CLIENTS: ClientLogo[] = [
  { name: 'Aloe Eva', logoUrl: 'assets/2/aloe-eva.webp' },
  { name: 'Man Look', logoUrl: 'assets/2/manlook.webp' }, // تم تصحيح الامتداد والمسار ليطابق الفولدر
  { name: 'Almajed Jewellery', logoUrl: 'assets/2/almajed.webp' },
  { name: 'Bless', logoUrl: 'assets/2/bless.webp' },
  { name: 'Camelion', logoUrl: 'assets/2/camelion.webp' },
  { name: 'Citystars Heliopolis', logoUrl: 'assets/2/citystars.webp' },
  { name: 'Doors & Doors', logoUrl: 'assets/2/doors-doors.webp' },
  { name: 'Ecopat', logoUrl: 'assets/2/ecopat.webp' },
  { name: 'Eva Cosmetics', logoUrl: 'assets/2/eva-cosmetics.webp' },
  { name: 'Eva Pharma', logoUrl: 'assets/2/eva-pharma.webp' },
  { name: 'Fluoro', logoUrl: 'assets/2/fluoro.webp' },
  { name: 'General', logoUrl: 'assets/2/general.webp' },
  { name: 'Guess', logoUrl: 'assets/2/guess.webp' },
  { name: 'IC Realty', logoUrl: 'assets/2/ic-realty.webp' },
  { name: 'Man Look', logoUrl: 'assets/2/manlook.webp' },
  { name: 'MCV', logoUrl: 'assets/2/mcv.webp' },
  { name: 'Misr Life Insurance', logoUrl: 'assets/2/misr-life.webp' },
  { name: 'My Diamond', logoUrl: 'assets/2/my-diamond.webp' },
  { name: 'Pandora', logoUrl: 'assets/2/pandora.webp' },
  { name: 'Sima', logoUrl: 'assets/2/sima.webp' },
  { name: 'Soter', logoUrl: 'assets/2/soter.webp' },
  { name: 'Vecas', logoUrl: 'assets/2/vecas.webp' },
  { name: 'Vivo', logoUrl: 'assets/2/vivo.webp' },
  { name: 'YOLO Cosmetics', logoUrl: 'assets/2/yolo-cosmetics.webp' },
  { name: 'YOLO France', logoUrl: 'assets/2/yolo-france.webp' }
];

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------
export const STATS: Stat[] = [
  {
    value: 10,
    suffix: '+',
    en: 'Years Experience',
    ar: 'سنوات خبرة',
  },
  {
    value: 500,
    suffix: '+',
    en: 'Completed Projects',
    ar: 'مشروع منفذ',
  },
  {
    value: 100,
    suffix: '+',
    en: 'Trusted Clients',
    ar: 'عميل موثوق',
  },
  {
    value: 25,
    suffix: '+',
    en: 'Production Services',
    ar: 'خدمة إنتاجية',
  },
];

// ---------------------------------------------------------------------------
// STAR MEDIA FULL COMPANY DETAILS
// ---------------------------------------------------------------------------
export const COMPANY_DETAILS = {
  name: "Star Media",
  tagline: "Production House & Creative Agency",
  type: "Creative Advertising Agency & Production House (Full-Service)",
  established: 2015,
  location: {
    en: "5 Abd El-Moneim Fawzi, New Nozha, Cairo, Egypt",
    ar: "٥ شارع عبد المنعم فوزي، النزهة الجديدة، القاهرة، مصر"
  },
  contacts: {
    email: "info@starmedia-eg.com",
    landline: "022 180 8835",
    phones: [
      "+20 122 9970 969",
      "+20 122 6094 687",
      "+20 127 7888 480"
    ]
  },
  about: {
    heroTitleEn: "WELCOME TO STAR MEDIA",
    heroTitleAr: "مرحباً بكم في ستار ميديا",
    subtitleEn: "Production House & Creative Agency",
    subtitleAr: "دار إنتاج ووكالة إبداعية متكاملة",
    descriptionEn: "At Star Media, we believe in the power of creativity to transform brands, inspire audiences, and deliver measurable impact. Since 2015, we've been combining bold ideas with cutting-edge production capabilities to help our clients stand out in a competitive market.",
    descriptionAr: "في ستار ميديا، نؤمن بقوة الإبداع في تحويل العلامات التجارية، وإلهام الجمهور، وتحقيق تأثير ملموس. منذ عام 2015، نجمع بين الأفكار الجريئة وإمكانيات الإنتاج المتطورة لمساعدة عملائنا على التميز في السوق.",
    missionEn: "Delivering innovative advertising solutions and high-quality production that elevate brands and leave a lasting impression.",
    missionAr: "تقديم حلول إعلانية مبتكرة وإنتاج عالي الجودة يرتقي بالعلامات التجارية ويدوم أثره.",
    visionEn: "To be the leading creative and production partner that helps brands shine brighter in every space.",
    visionAr: "أن نكون الشريك الإبداعي والإنتاجي الرائد الذي يساعد العلامات التجارية على التألق في كل مكان."
  },

  // 🔗 الـ 8 خدمات الحقيقية — الـ slug هنا لازم يطابق حرفيًا الـ key في
  // servicesDictionary جوه service-details.component.ts عشان زرار
  // "Explore Service" يوصل لصفحة التفاصيل الصح مع الـ categoryId الصح.
serviceGroups: [

    // 01 / 08 - BOOTH FABRICATION -> Booths (id: 1)
    {
      slug: "booth-fabrication",
      en: "Booth Fabrication",
      ar: "تصنيع البوثات وأجنحة العرض",
      img: "assets/New-folder/jpg",
      desc: "Modular and custom booths built in-house with CNC precision and rapid assembly.",
      desc_ar: "تصنيع محلي في مصانعنا للبوثات الخشبية والألومنيوم والبوثات التفاعلية.",
      items: ["In-House CNC Fabrication", "Duco & PU Spray Paint", "Embedded LED Strips", "Flat-Pack Transport"],
      itemsAr: ["قص وتقفيل CNC", "دهانات دوكو ودوكو فرن", "إضاءة مخفية مدمجة", "سهولة النقل والتفكيك"]
    },

    // 02 / 08 - EXHIBITION DESIGN & BUILD -> Exhibitions (id: 2)
    {
      slug: "exhibition-design-build",
      en: "Exhibition Design & Build",
      ar: "تصميم وتنفيذ جناح المعارض",
      img: "assets/project-exhibition-1.jpg",
      desc: "From strategy to install — 12m to 900 sqm architectural exhibition stands.",
      desc_ar: "حلول متكاملة للتصميم المعماري وتنفيذ أجنحة المعارض من 12 حتى 900 متر مربع.",
      items: ["Custom Wooden Architecture", "3D Spatial CAD", "Power & Cable Management", "Venue Permits"],
      itemsAr: ["هياكل خشبية ديكورية", "تصميم 3D عالي الدقة", "شبكات الكهرباء والإضاءة", "تراخيص المعارض"]
    },

    // 03 / 08 - EVENTS, ACTIVATIONS, USHERS & SECURITY -> Events (id: 3)
    {
      slug: "events-activations",
      en: "Events, Activations, Ushers & Security",
      ar: "تنظيم الفعاليات والتفعيل والضيافة والحراسة",
      img: "assets/project-event.jpg",
      desc: "Turnkey production for galas, launches and roadshows, plus trained ushers and security guards.",
      desc_ar: "تجهيز الفعاليات بالكامل مع طاقم تنظيم وضيافة وأمن وحراسة.",
      items: ["Ushering & Registration Staff", "Security Guards & Crowd Control", "Interactive Brand Activations", "Stage, AV & Truss Rigs"],
      itemsAr: ["طاقم التنظيم والـ Ushering", "أطقم الأمن والحراسة", "حملات التفعيل التفاعلية", "المسرح والأنظمة الصوتية"]
    },

    // 04 / 08 - CAR BRANDING & FLEET WRAPS -> Car Branding (id: 4)
    {
      slug: "car-branding",
      en: "Car Branding & Fleet Wraps",
      ar: "تغليف السيارات وأساطيل الشركات",
      img: "assets/project-car-branding.jpg",
      desc: "Full and partial vehicle wraps at fleet scale, engineered for high visibility.",
      desc_ar: "تغليف كامل وجزئي لسيارات وأساطيل الشركات بأعلى خامات الفينيل.",
      items: ["Fleet Cast Vinyl Wraps", "Original Paint Protection", "One-Way Vision Glass", "3-Year Warranty"],
      itemsAr: ["تغليف أساطيل المركبات", "حماية الطلاء الأصلي", "فينيل رؤية واحدة للزجاج", "ضمان 3 سنوات"]
    },

    // 05 / 08 - BRANDING & SIGNAGE -> Signage (id: 5)
    {
      slug: "branding-signage",
      en: "Branding & Signage",
      ar: "الهوية البصرية واللافتات الإعلانية",
      img: "assets/project-signage.jpg",
      desc: "3D letters, backlit facades, and complete wayfinding systems.",
      desc_ar: "حروف مضيئة ثلاثية الأبعاد، واجهات ليد، وأنظمة إرشادية متكاملة.",
      items: ["3D Illuminated Letters", "Alucobond Facades", "Wayfinding Systems", "Brand Guidelines"],
      itemsAr: ["حروف 3D مضيئة", "واجهات كلادينج", "الأنظمة الإرشادية", "دليل الهوية البصرية"]
    },

    // 06 / 08 - INDOOR & OUTDOOR PRINTING -> Printing (id: 6)
    {
      slug: "indoor-outdoor-printing",
      en: "Indoor & Outdoor Printing",
      ar: "الطباعة الداخلية والخارجية",
      img: "assets/indoor.png",
      desc: "Wide-format UV, eco-solvent printing with premium finishing.",
      desc_ar: "طباعة كبيرة الحجم وتقنيات UV وإيكو-سولفنت مع تقفيل صناعي متكامل.",
      items: ["UV & Eco-Solvent Tech", "Weather Guarantee", "Pantone Color Accuracy", "Automated Finishing"],
      itemsAr: ["تقنيات UV وإيكو-سولفنت", "مقاومة للشمس والعوامل الجوية", "مطابقة الألوان", "التقفيل الرقمي"]
    },

    // 07 / 08 - CUSTOM STANDS -> Custom Stands (id: 7)
    {
      slug: "custom-stands",
      en: "Custom Stands",
      ar: "ستاندات مخصصة",
   img: "assets/stand.png",
      desc: "Bespoke display stands tailored to your brand and space, combining durability with accurate finishing.",
      desc_ar: "ستاندات عرض مصممة خصيصًا لهويتك ومساحتك بمتانة ودقة تنفيذ عالية.",
      items: ["Custom Sizing", "Premium Materials", "Quick Assembly", "Brand-Accurate Finish"],
      itemsAr: ["مقاسات مخصصة", "خامات فاخرة", "تركيب سريع", "تطابق دقيق مع الهوية"]
    },

    // 08 / 08 - GIVEAWAYS -> Giveaways (id: 8)
    {
      slug: "giveaways",
      en: "Giveaways",
      img: "assets/Giveaways.png",
      desc: "Branded merchandise and promotional items at scale with fast turnaround.",
      desc_ar: "منتجات ترويجية مطبوعة بهويتك بأي كمية وبسرعة تسليم عالية.",
      items: ["Bulk Production", "Wide Product Range", "Custom Branding", "Fast Turnaround"],
      itemsAr: ["إنتاج بكميات كبيرة", "تشكيلة منتجات واسعة", "طباعة الهوية", "تسليم سريع"]
    }

  ],
capabilities: {
    equipment: [
      {
        en: "Cutter Plotter",
        ar: "بلوتر القص",
        img: "assets/equipment/Cutter.jpeg",
        desc: "Precision vinyl cutting for signage, wraps and decals with clean, sharp edges every time.",
        desc_ar: "قص دقيق للفينيل للافتات والتغليف والملصقات بحواف نظيفة وحادة في كل مرة."
      },
      {
        en: "Indoor & Outdoor Printing Machines",
        ar: "مكن الطباعة الداخلية والخارجية",
         img: "assets/equipment/Indoor.jpeg",
        desc: "Wide-format UV and eco-solvent printers delivering vivid, weather-resistant output at scale.",
        desc_ar: "طابعات UV وإيكو-سولفنت واسعة النطاق بألوان زاهية ومقاومة للعوامل الجوية بأي كمية."
      },
      {
        en: "Laser Cutting Equipment",
        ar: "مكن القطع بالليزر",
         img: "assets/equipment/Laser.jpeg",
        desc: "High-precision laser cutting for intricate details across wood, acrylic and metal sheets.",
        desc_ar: "قطع بالليزر بدقة عالية لتفاصيل معقدة على الخشب والأكريليك وألواح المعدن."
      },
      {
        en: "CNC & Wood Routing Machines",
        ar: "مكن CNC وتشكيل الخشب",
         img: "assets/equipment/CNC.jpeg",
        desc: "Computer-controlled routing for custom architectural shapes and repeatable exhibition components.",
        desc_ar: "تشكيل يتحكم فيه الكمبيوتر لأشكال معمارية مخصصة ومكونات معارض قابلة للتكرار بدقة."
      },
      {
        en: "Industrial Spray Painting & Finishing Stations",
        ar: "محطات الدهان الصناعي والتشطيب",
         img: "assets/equipment/Painting.jpeg",
        desc: "Duco and PU spray finishing in a controlled environment for a flawless, showroom-ready surface.",
        desc_ar: "دهانات دوكو وPU في بيئة مضبوطة للحصول على سطح لا تشوبه شائبة جاهز للعرض."
      },
      {
        en: "Metal & Carpentry Fabrication Workshops",
        ar: "ورش تصنيع المعادن والنجارة",
       img: "assets/equipment/Metal.jpeg",
        desc: "Full in-house welding and joinery capability, from structural frames to fine cabinetry.",
        desc_ar: "قدرات لحام ونجارة كاملة داخل المصنع، من الهياكل الإنشائية إلى الدواليب الدقيقة."
      }
    ]
  }
};
