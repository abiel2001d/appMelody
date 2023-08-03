import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndexComponent } from './producto-index/producto-index.component';
import { ProductoAllComponent } from './producto-all/producto-all.component';
import { ProductoDetailComponent } from './producto-detail/producto-detail.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { AuthGuard } from '../share/guards/auth.guard';

const routes: Routes = [
  {path:'producto',component:ProductoIndexComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,3]
  }},
  {path:'producto/all',component:ProductoAllComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2]
  }},
  {path:'producto/create', component: ProductoFormComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2]
  }},
  {path:'producto/:id',component:ProductoDetailComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2,3]
  }},
  {path:'producto/update/:id', component: ProductoFormComponent,
  canActivate:[AuthGuard],
  data:{
    roles: [1,2]
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
