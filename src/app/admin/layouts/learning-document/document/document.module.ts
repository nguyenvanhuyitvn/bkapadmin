import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import { PipeModule } from 'src/app/admin/shared/pipe/pipe.module';

@NgModule({
  declarations: [EditComponent, AddComponent, ListComponent],
  imports: [
    CommonModule,
    DocumentRoutingModule,
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
    MatDatepickerModule,
    PipeModule
  ]
})
export class DocumentModule { }
