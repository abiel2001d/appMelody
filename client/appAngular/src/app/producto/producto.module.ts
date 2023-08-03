import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductoDetailComponent } from './producto-detail/producto-detail.component';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { ProductoDialogComponent } from './producto-dialog/producto-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    ProductoIndexComponent,
    ProductoDetailComponent,
    ProductoAllComponent,
    ProductoFormComponent,
    ProductoDialogComponent
  ],
  imports: [
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ProductoRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    NgFor,
    MatSelectModule,
    MatDialogModule,
    CoreModule
  ]
})
export class ProductoModule { }
