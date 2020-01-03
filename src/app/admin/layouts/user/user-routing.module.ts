import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { RepassComponent } from './repass/repass.component';


const routes: Routes = [
  {
    path:'',
    children: [
      { path:'', component: ListComponent },
      { path:'them-moi', component: AddComponent },
      { path:'sua/:id', component: EditComponent },
      { path:'doi-mat-khau/:id', component: RepassComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
