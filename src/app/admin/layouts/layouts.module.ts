import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsRoutingModule } from './layouts-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutsComponent } from './layouts.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DashboardComponent, LayoutsComponent, HeaderComponent, FooterComponent, LeftMenuComponent],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LayoutsModule { }
