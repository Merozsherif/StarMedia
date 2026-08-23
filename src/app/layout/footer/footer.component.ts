import { Component } from '@angular/core';
import { AppService } from '../../core/services/app.service';


interface FooterLink {
  to: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {

  year = new Date().getFullYear();

  constructor(public site: AppService) {}

  get exploreLinks(): FooterLink[] {
    return [
      { to: '/', label: this.site.t('Home', 'الرئيسية') },
      { to: '/about', label: this.site.t('About Us', 'من نحن') },
      { to: '/services', label: this.site.t('Services', 'خدماتنا') },
      { to: '/portfolio', label: this.site.t('Portfolio', 'أعمالنا') },
      { to: '/clients', label: this.site.t('Clients', 'عملاؤنا') },
      { to: '/contact', label: this.site.t('Contact', 'تواصل معنا') },
    ];
  }

  get capabilityLinks(): FooterLink[] {
    return [
      { to: '/services', label: this.site.t('Booths & Exhibitions', 'الأجنحة والمعارض') },
      { to: '/services', label: this.site.t('Printing Solutions', 'حلول الطباعة') },
      { to: '/services', label: this.site.t('Branding Production', 'تنفيذ البراندنج') },
      { to: '/services', label: this.site.t('Events & Activations', 'الفعاليات والتفعيلات') },
      { to: '/services', label: this.site.t('Creative Design', 'التصميم الإبداعي') },
    ];
  }

}
