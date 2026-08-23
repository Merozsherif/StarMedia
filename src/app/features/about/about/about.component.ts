import { Component } from '@angular/core';
// غيّر السطر ده للمسار الصحيح:
import { AppService } from '../../../core/services/app.service';
import { COMPANY_DETAILS } from '../../../shared/data/site-data';
// ملاحظة: لو الملف جوه about/about/ حاول تخليه ../../../core/services/app.service
// أو استخدم المسار المطلق من الـ app:
// import { AppService } from 'src/app/core/services/app.service';
export interface IconCard {
  icon: string;
  k: string;
  v: string;
}

export interface Machinery {
  img: string;
  name: string;
  spec: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  constructor(public site: AppService) {}
equipment = COMPANY_DETAILS.capabilities.equipment;

  get missionVision(): IconCard[] {
    return [
      {
        icon: '🎯',
        k: this.site.t('Mission', 'رسالتنا'),
        v: this.site.t(
          'Delivering innovative advertising solutions and premium production that elevate brands and create lasting impressions.',
          'تقديم حلول إعلانية مبتكرة وإنتاج عالي الجودة يساعد العلامات التجارية على تحقيق تأثير دائم.'
        ),
      },
      {
        icon: '🚀',
        k: this.site.t('Vision', 'رؤيتنا'),
        v: this.site.t(
          'To become the leading creative production partner trusted by brands across Egypt and the Middle East.',
          'أن نكون الشريك الإبداعي والإنتاجي الأول للعلامات التجارية في مصر والشرق الأوسط.'
        ),
      },
    ];
  }

  get whyChooseUs(): IconCard[] {
    return [
      {
        icon: '🎨',
        k: this.site.t('Creative Team', 'فريق إبداعي'),
        v: this.site.t(
          'Professional designers specialized in branding and visual communication.',
          'فريق محترف من المصممين المتخصصين في الهوية البصرية والتصميم الإبداعي.'
        ),
      },
      {
        icon: '🏭',
        k: this.site.t('In-House Production', 'إنتاج داخلي'),
        v: this.site.t(
          'Complete production facility equipped with advanced machinery.',
          'مصنع متكامل مجهز بأحدث المعدات وتقنيات الإنتاج.'
        ),
      },
      {
        icon: '⚡',
        k: this.site.t('Fast Delivery', 'سرعة التنفيذ'),
        v: this.site.t(
          'Fast turnaround while maintaining premium quality.',
          'تنفيذ سريع مع الحفاظ على أعلى معايير الجودة.'
        ),
      },
      {
        icon: '✔',
        k: this.site.t('Quality Assurance', 'ضمان الجودة'),
        v: this.site.t(
          'Every project passes through strict quality control.',
          'كل مشروع يخضع لمراحل دقيقة من مراجعة الجودة.'
        ),
      },
      {
        icon: '🤝',
        k: this.site.t('End-to-End Solutions', 'حلول متكاملة'),
        v: this.site.t(
          'From concept and design to production and installation.',
          'من الفكرة والتصميم وحتى الإنتاج والتركيب.'
        ),
      },
      {
        icon: '⭐',
        k: this.site.t('Trusted Partner', 'شريك موثوق'),
        v: this.site.t(
          'Trusted by leading local and international brands.',
          'موثوق من كبرى العلامات التجارية المحلية والعالمية.'
        ),
      },
    ];
  }

  get machinery(): Machinery[] {
    return [
      {
        img: 'assets/machinery-printer.jpg',
        name: this.site.t(
          'Indoor & Outdoor Printing Machines',
          'ماكينات الطباعة الداخلية والخارجية'
        ),
        spec: this.site.t(
          'Large Format Printing',
          'طباعة عالية الجودة بمقاسات كبيرة'
        ),
      },
      {
        img: 'assets/machinery-cnc.jpg',
        name: this.site.t(
          'CNC & Wood Routing Machines',
          'ماكينات CNC والراوتر'
        ),
        spec: this.site.t(
          'Wood • MDF • Acrylic',
          'خشب • MDF • أكريليك'
        ),
      },
      {
        img: 'assets/machinery-laser.jpg',
        name: this.site.t(
          'Laser Cutting Equipment',
          'ماكينات الليزر'
        ),
        spec: this.site.t(
          'High Precision Cutting',
          'دقة عالية في القص والتصنيع'
        ),
      },
      {
        img: 'assets/factory.jpg',
        name: this.site.t(
          'Metal & Carpentry Workshops',
          'ورش الحدادة والنجارة'
        ),
        spec: this.site.t(
          'Custom Fabrication',
          'تصنيع مخصص لجميع المشروعات'
        ),
      },
      {
        img: 'assets/hero-booth.jpg',
        name: this.site.t(
          'Spray Painting & Finishing',
          'وحدات الدهان والتشطيب'
        ),
        spec: this.site.t(
          'Premium Finishing',
          'تشطيبات احترافية عالية الجودة'
        ),
      },
      {
        img: 'assets/factory-1.jpg',
        name: this.site.t(
          'Vinyl Cutter Plotter',
          'ماكينة قص الفينيل'
        ),
        spec: this.site.t(
          'Signs & Branding',
          'لافتات وهوية بصرية'
        ),
      },
    ];
  }

  get workflowSteps(): string[] {
    return [
      this.site.t('Client Brief', 'استلام متطلبات العميل'),
      this.site.t('Creative Concept', 'تطوير الفكرة'),
      this.site.t('Design & Approval', 'التصميم والاعتماد'),
      this.site.t('Production', 'الإنتاج'),
      this.site.t('Installation', 'التركيب'),
      this.site.t('Delivery', 'التسليم النهائي'),
    ];
  }
}
