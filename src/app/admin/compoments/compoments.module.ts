import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompomentsRoutingModule } from './compoments-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    CompomentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule
  ]
})
export class CompomentsModule { }
