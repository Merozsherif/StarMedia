import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 👈 مهم جداً عشان الـ Login والـ Forms
import { AdminRoutingModule } from './admin-routing.module';

import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { ServicesAdminComponent } from './services-admin/services-admin.component';
import { ImageCropperComponent } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    LoginComponent,
    AdminLayoutComponent,
    DashboardComponent,
    ManageCategoriesComponent,
    ManageProjectsComponent,
    ServicesAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    ImageCropperComponent
  ]
})
export class AdminModule { }
