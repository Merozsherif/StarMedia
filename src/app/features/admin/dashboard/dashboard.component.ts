import { Component, OnInit, signal } from '@angular/core';
import { AppService } from '../../../core/services/app.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = signal<any>(null);
  isLoading = signal<boolean>(true);

  constructor(public site: AppService) {} // استخدام الـ AppService الحالي

  ngOnInit(): void {
    this.loadStats();
  }

loadStats(): void {
    this.isLoading.set(true);
    this.site.getAdminStats().subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.stats.set(res.data); // هنا البيانات (totalProjects, totalCategories, featuredProjectsCount)
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error fetching admin stats:', err);
        this.isLoading.set(false);
      }
    });
  }
}
