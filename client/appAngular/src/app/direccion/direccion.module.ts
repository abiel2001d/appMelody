import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DireccionRoutingModule } from './direccion-routing.module';
import { DireccionIndexComponent } from './direccion-index/direccion-index.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DireccionIndexComponent
  ],
  imports: [
    CommonModule,
    DireccionRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ]
})
export class DireccionModule { }
