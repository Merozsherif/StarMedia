import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services/services.component';
import { ServicesRoutingModule } from './services-routing.module';
import { ServiceDetailsComponent } from '../service-details/service-details/service-details.component';



@NgModule({
  declarations: [
    ServicesComponent,
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule
  ]
})
export class ServicesModule { }
