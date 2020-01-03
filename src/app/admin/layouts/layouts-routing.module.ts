import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutsComponent } from './layouts.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'tai-lieu', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule) },
      { path: 'sinh-vien', loadChildren: () => import('./student/student.module').then(m => m.StudentModule) },
      { path: 'tin-tuc', loadChildren: () => import('./news/news.module').then(m => m.NewsModule) },
      { path: 'tai-lieu-hoc-tap', loadChildren: () => import('./learning-document/learning-document.module').then(m => m.LearningDocumentModule) },
      { path: 'ho-tro-hoc-tap', loadChildren: () => import('./supports/supports.module').then(m => m.SupportsModule) },
      { path: 'lop-hoc', loadChildren: () => import('./classes/classes.module').then(m => m.ClassesModule) },
      { path: 'khoa-hoc', loadChildren: () => import('./course/course.module').then(m => m.CourseModule) },
      { path: 'mon-hoc', loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule) },
      { path: 'gop-y', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
      { path: 'nguoi-dung', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
      { path: 'banner', loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule) }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
