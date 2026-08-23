import { Component } from '@angular/core';
import { AppService } from '../../../core/services/app.service';


export interface ServiceItem {
  slug: string;
  categorySlug: string; // 🔗 الربط مع الـ Category بتاعت الفلترة في الـ Portfolio
  img: string;
  en: string;
  ar: string;
  desc_en: string;
  desc_ar: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  services: ServiceItem[] = [
    // 01 / 08 - Booths (id: 1)
    { slug: 'booth-fabrication', categorySlug: 'booths', img: 'assets/project-booth-1.jpg', en: 'Booth Fabrication', ar: 'تصنيع الأجنحة', desc_en: 'Modular and custom booths built in-house.', desc_ar: 'أجنحة معيارية ومخصصة داخل مصنعنا.' },

    // 02 / 08 - Exhibitions (id: 2)
    { slug: 'exhibition-design-build', categorySlug: 'exhibitions', img: 'assets/project-exhibition-1.jpg', en: 'Exhibition Design & Build', ar: 'تصميم وبناء المعارض', desc_en: 'From strategy to install — 12m to 900 sqm exhibits.', desc_ar: 'من الاستراتيجية إلى التركيب — من 12 إلى 900 م².' },

    // 03 / 08 - Events (id: 3)
    { slug: 'events-activations', categorySlug: 'events', img: 'assets/project-event.jpg', en: 'Events & Activations', ar: 'الفعاليات والتفعيل', desc_en: 'Turnkey production for galas, launches, roadshows.', desc_ar: 'إنتاج متكامل للفعاليات والإطلاقات.' },

    // 04 / 08 - Car Branding (id: 4)
    { slug: 'car-branding', categorySlug: 'car-branding', img: 'assets/project-car-branding.jpg', en: 'Car Branding & Fleet Wraps', ar: 'تغليف السيارات', desc_en: 'Full and partial vehicle wraps at fleet scale.', desc_ar: 'تغليف كامل أو جزئي بمقاييس الأسطول.' },

    // 05 / 08 - Signage (id: 5)
    { slug: 'branding-signage', categorySlug: 'signage', img: 'assets/project-signage.jpg', en: 'Branding & Signage', ar: 'الهوية واللافتات', desc_en: '3D letters, backlit facades, wayfinding systems.', desc_ar: 'حروف ثلاثية الأبعاد ولافتات مضاءة.' },

    // 06 / 08 - Printing (id: 6)
    { slug: 'indoor-outdoor-printing', categorySlug: 'signage', img: 'assets/indoor.png', en: 'Indoor & Outdoor Printing', ar: 'الطباعة الداخلية والخارجية', desc_en: 'Wide-format UV, eco-solvent and premium finishing.', desc_ar: 'طباعة يو في كبيرة ونوعية عالية.' },

    // 07 / 08 - Custom Stands (id: 7)
    { slug: 'custom-stands', categorySlug: 'custom-stands', img: "assets/stand.png", en: 'Custom Stands', ar: 'ستاندات مخصصة', desc_en: 'Bespoke display stands tailored to your brand and space.', desc_ar: 'ستاندات عرض مصممة خصيصًا لهويتك ومساحتك.' },

    // 08 / 08 - Giveaways (id: 8)
    { slug: 'giveaways', categorySlug: 'giveaways',   img: "assets/Giveaways.png", en: 'Giveaways', ar: 'الهدايا الترويجية', desc_en: 'Branded merchandise and promotional items at scale.', desc_ar: 'منتجات ترويجية مطبوعة بهويتك بأي كمية.' },
  ];

  constructor(public site: AppService) {}
}
