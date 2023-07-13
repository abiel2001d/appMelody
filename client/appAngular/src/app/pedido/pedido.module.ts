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

@NgModule({
  declarations: [
    PedidoIndexComponent,
    PedidoAllComponent,
    PedidoDetailComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class PedidoModule { }
