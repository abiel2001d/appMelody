import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetodoPagoAllComponent } from './metodo-pago-all/metodo-pago-all.component';

const routes: Routes = [
  {path:'metodoPago',component:MetodoPagoAllComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetodoPagoRoutingModule { }
