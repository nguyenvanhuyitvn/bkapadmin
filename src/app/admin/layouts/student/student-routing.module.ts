import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
   {
     path: '',
     children: [
        {
          path: 'danh-sach', component: ListComponent
        },
        {
          path: 'them-moi', component: AddComponent
        },
        {
          path: 'sua/:id', component: EditComponent
        }
     ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
