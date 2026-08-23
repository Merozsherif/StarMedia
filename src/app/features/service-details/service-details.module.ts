import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceDetailsRoutingModule } from './service-details-routing.module';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ServiceDetailsComponent // 👈 هنا مكانها الصحيح والوحيد
  ],
  imports: [
    CommonModule,
    ServiceDetailsRoutingModule,
    SharedModule
  ]
})
export class ServiceDetailsModule { }
