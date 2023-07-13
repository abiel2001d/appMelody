import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { ProductoDetailComponent } from './producto-detail/producto-detail.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';

const routes: Routes = [
  {path:'producto',component:ProductoIndexComponent},
  {path:'producto/all',component:ProductoAllComponent},
  {path:'producto/create', component: ProductoFormComponent},
  {path:'producto/:id',component:ProductoDetailComponent},
  {path:'producto/update/:id', component: ProductoFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
