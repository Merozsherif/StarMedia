import { Component } from '@angular/core';
import { CLIENTS, ClientLogo } from '../../../shared/data/site-data';
import { AppService } from '../../../core/services/app.service';

interface Testimonial {
  name: string;
  role: string;
  en: string;
  ar: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent {
  // استخدام القائمة الأساسية بدون تكرار
  clientsGrid: ClientLogo[] = CLIENTS;

  TESTIMONIALS: Testimonial[] = [
    {
      name: 'Quality',
      role: 'Our Promise',
      en: 'We deliver every project with precision, premium materials and uncompromising quality.',
      ar: 'ننـفذ كل مشروع بأعلى معايير الجودة والدقة باستخدام أفضل الخامات.'
    },
    {
      name: 'Creativity',
      role: 'Our Approach',
      en: 'Every brand deserves a unique visual experience built on creative thinking and smart execution.',
      ar: 'كل علامة تجارية تستحق تجربة بصرية فريدة تعتمد على الإبداع والتنفيذ الاحترافي.'
    },
    {
      name: 'Commitment',
      role: 'Our Standard',
      en: 'From concept to installation, our team is committed to delivering on time with complete professionalism.',
      ar: 'من الفكرة وحتى التنفيذ النهائي نلتزم بتسليم المشاريع في موعدها وبأعلى مستوى من الاحترافية.'
    }
  ];

  constructor(public site: AppService) {}
}
