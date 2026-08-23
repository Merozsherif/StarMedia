import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesComponent } from './services/services.component';
import { ServiceDetailsComponent } from '../service-details/service-details/service-details.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent // صفحة كروت الخدمات فقط /services
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
