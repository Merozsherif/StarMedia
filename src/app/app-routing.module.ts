import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // 🔑 1. مسار الأدمن (Lazy Loading) - منفصل عن الهيكل العام للموقع
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },

  // 🌐 2. باقي الموقع (الصفحات العامة بالـ Layout بتاعها)
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout.module').then(m => m.LayoutModule)
  },

  // ❌ 3. إعادة التوجيه للمسارات غير المعروفة
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
