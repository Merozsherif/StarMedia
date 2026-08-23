import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectDetailsRoutingModule } from './project-details-routing.module';



@NgModule({
  declarations: [
    ProjectDetailsComponent
  ],
  imports: [
    CommonModule,
    ProjectDetailsRoutingModule
  ]
})
export class ProjectDetailsModule { }
