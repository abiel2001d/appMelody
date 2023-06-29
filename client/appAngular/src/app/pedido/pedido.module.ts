import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';


@NgModule({
  declarations: [
    PedidoIndexComponent
  ],
  imports: [
    CommonModule,
    PedidoRoutingModule
  ]
})
export class PedidoModule { }
