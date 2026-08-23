import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AppService } from '../../core/services/app.service';


interface NavItem {
  to: string;
  en: string;
  ar: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  nav: NavItem[] = [
    { to: '/', en: 'Home', ar: 'الرئيسية' },
    { to: '/about', en: 'About Us', ar: 'من نحن' },
    { to: '/services', en: 'Services', ar: 'خدماتنا' },
    { to: '/portfolio', en: 'Portfolio', ar: 'أعمالنا' },
    { to: '/clients', en: 'Clients', ar: 'عملاؤنا' },
    { to: '/contact', en: 'Contact', ar: 'تواصل معنا' },
  ];

  scrolled = false;
  open = false;
  pathname = '/';

  private sub?: Subscription;

  constructor(
    public site: AppService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pathname = this.router.url;

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.pathname = e.urlAfterRedirects;
        this.open = false;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  isActive(to: string): boolean {
    return this.pathname === to ||
      (to !== '/' && this.pathname.startsWith(to));
  }

  toggleMenu(): void {
    this.open = !this.open;
  }
}
