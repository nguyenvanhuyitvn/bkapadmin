import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', loadChildren: () => import('./document/document.module').then(m => m.DocumentModule) },
      { path: 'danh-muc', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningDocumentRoutingModule { }
