import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { HomeRoutingModule } from './home-routing.module';
import { InicioComponent } from './inicio/inicio.component';


@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatIconModule
  ]
})
export class HomeModule { }
