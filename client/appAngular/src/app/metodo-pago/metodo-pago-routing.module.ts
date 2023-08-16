import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetodoPagoAllComponent } from './metodo-pago-all/metodo-pago-all.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'metodoPago',component:MetodoPagoAllComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [3]
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetodoPagoRoutingModule { }
