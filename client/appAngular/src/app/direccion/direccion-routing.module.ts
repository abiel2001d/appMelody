import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DireccionAllComponent } from './direccion-all/direccion-all.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'direccion',component:DireccionAllComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [2,3]
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DireccionRoutingModule { }
