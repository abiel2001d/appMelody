import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoAllComponent } from './pedido-all/pedido-all.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PedidoDetailComponent } from './pedido-detail/pedido-detail.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { EvaluacionDialogComponent } from './evaluacion-dialog/evaluacion-dialog.component';
import {MatSliderModule} from '@angular/material/slider';
import { ReporteComponent } from './reporte/reporte.component';

@NgModule({
  declarations: [
    PedidoIndexComponent,
    PedidoAllComponent,
    PedidoDetailComponent,
    EvaluacionDialogComponent,
    ReporteComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSliderModule
  ]
})
export class PedidoModule { }
