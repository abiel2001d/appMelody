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



@NgModule({
  declarations: [
    ProductoIndexComponent,
    ProductoDetailComponent,
    ProductoAllComponent
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
    MatCheckboxModule
  ]
})
export class ProductoModule { }
