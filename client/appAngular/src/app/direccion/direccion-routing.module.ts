import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DireccionIndexComponent } from './direccion-index/direccion-index.component';

const routes: Routes = [
  {path:'direccion',component:DireccionIndexComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DireccionRoutingModule { }
