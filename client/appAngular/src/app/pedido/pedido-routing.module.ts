import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoAllComponent } from './pedido-all/pedido-all.component';
import { PedidoDetailComponent } from './pedido-detail/pedido-detail.component';

const routes: Routes = [
  {path:'pedido',component:PedidoIndexComponent},
  {path:'pedido/all',component:PedidoAllComponent},
  //{path:'pedido/create', component: ProductoFormComponent},
  {path:'pedido/:id',component:PedidoDetailComponent},
  //{path:'pedido/update/:id', component: ProductoFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
