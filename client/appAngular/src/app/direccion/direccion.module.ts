import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionRoutingModule } from './direccion-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DireccionAllComponent } from './direccion-all/direccion-all.component';
import { DireccionFormComponent } from './direccion-form/direccion-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [
    DireccionAllComponent,
    DireccionFormComponent
  ],
  imports: [
    CommonModule,
    DireccionRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class DireccionModule { }
