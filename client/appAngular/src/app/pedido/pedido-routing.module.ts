import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndexComponent } from './pedido-index/pedido-index.component';
import { PedidoAllComponent } from './pedido-all/pedido-all.component';
import { PedidoDetailComponent } from './pedido-detail/pedido-detail.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'pedido',component:PedidoIndexComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [3]
  }},
  {path:'pedido/all',component:PedidoAllComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2,3]
  }},
  //{path:'pedido/create', component: ProductoFormComponent},
  {path:'pedido/:id',component:PedidoDetailComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2,3]
  }},
  //{path:'pedido/update/:id', component: ProductoFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }
