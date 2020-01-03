import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamScheduleRoutingModule } from './exam-schedule-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule,MatFormFieldModule, MatButtonModule, MatIconModule, MatNativeDateModule } from '@angular/material';
import { MatCardModule} from '@angular/material/card';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [ListComponent, EditComponent, AddComponent],
  imports: [
    CommonModule,
    ExamScheduleRoutingModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatCardModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ]
})
export class ExamScheduleModule { }
