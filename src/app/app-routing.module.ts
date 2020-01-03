import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'prefix'},
	{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [BrowserModule,
            CommonModule,
            RouterModule.forRoot(routes)],
  exports: [RouterModule, CommonModule]
})
export class AppRoutingModule { }
