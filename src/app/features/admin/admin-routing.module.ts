import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { authGuard } from '../../core/guards/auth.guard';
import { ServicesAdminComponent } from './services-admin/services-admin.component';

const routes: Routes = [
  // صفحة تسجيل الدخول (بدون Layout وبدون Guard)
  { path: 'login', component: LoginComponent },

  // صفحات اللوحة (بداخل الـ Admin Layout ومحمية بـ AuthGuard)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: ManageCategoriesComponent },
      { path: 'projects', component: ManageProjectsComponent },
      // { path: 'services', component: ServicesAdminComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
