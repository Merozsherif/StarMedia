import { Component } from '@angular/core';
import { AppService } from '../../../core/services/app.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  services = ['Exhibitions', 'Booths', 'Printing', 'Branding', 'Signage', 'Car Branding', 'Events', 'Creative'];
  sent = false;

  name = '';
  email = '';
  phone = '';
  service = '';
  message = '';

  constructor(public site: AppService) {}

  submit(): void {
    // TODO: wire this up to your backend endpoint (e.g. POST /api/Contact)
    this.sent = true;
  }
}
