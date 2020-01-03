import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
{
	path: '',
	children: [
		{ path: '', loadChildren: () => import('./bkapnews/bkapnews.module').then(m => m.BkapnewsModule) },
		{ path: 'danh-muc', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule) },
		{ path: 'tin-tuc', loadChildren: () => import('./bkapnews/bkapnews.module').then(m => m.BkapnewsModule) }
	]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
