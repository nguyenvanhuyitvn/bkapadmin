import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [ListComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    BannerRoutingModule
  ]
})
export class BannerModule { }
