import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApiService, Menu } from 'src/app/admin/shared';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'van-ban', loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) },
      { path: 'lich-thi', loadChildren: () => import('./exam-schedule/exam-schedule.module').then(m => m.ExamScheduleModule) },
      { path: 'thoi-khoa-bieu', loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule) },
      { path: 'danh-muc/:type', loadChildren: () => import('./../learning-document/learning-document.module').then(m => m.LearningDocumentModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule {
  // public Menus: any = [];
  // constructor(private api: ApiService){
  //   this.Menus = new Menu(this.api);
  //   this.Menus.loadMenus();
  // }
}
