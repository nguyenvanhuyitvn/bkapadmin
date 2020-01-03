import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
const routes: Routes = [
	{ path: '', loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule), canActivate: [AuthGuard] },
	// { path: '', loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule) },
  { path: 'xac-thuc', loadChildren: () => import('./compoments/compoments.module').then(m => m.CompomentsModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
