import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'about',
        loadChildren: () =>
          import('../features/about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'services',
        loadChildren: () =>
          import('../features/services/services.module').then(m => m.ServicesModule)
      },

      // 🔹 المسار الجديد لتفاصيل الخدمة
      {
        path: 'services/:slug',
        loadChildren: () =>
          import('../features/service-details/service-details.module')
            .then(m => m.ServiceDetailsModule)
      },

      {
        path: 'portfolio',
        loadChildren: () =>
          import('../features/portfolio/portfolio.module').then(m => m.PortfolioModule)
      },
      {
        path: 'portfolio/:id',
        loadChildren: () =>
          import('../features/project-details/project-details.module')
            .then(m => m.ProjectDetailsModule)
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('../features/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('../features/contact/contact.module').then(m => m.ContactModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
