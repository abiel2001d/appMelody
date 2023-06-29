import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';

const routes: Routes = [
  {path:'pedido',component:PedidoIndexComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
