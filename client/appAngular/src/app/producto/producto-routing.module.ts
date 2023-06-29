import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoAllComponent } from './producto-all/producto-all.component';

const routes: Routes = [
  {path:'producto',component:ProductoIndexComponent},
  {path:'producto/all',component:ProductoAllComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
