import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioIndexComponent } from './usuario-index/usuario-index.component';
import { UsuarioLoginComponent } from './usuario-login/usuario-login.component';
import { UsuarioCreateComponent } from './usuario-create/usuario-create.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider'; 
import {MatDialogModule} from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { UsuarioAllComponent } from './usuario-all/usuario-all.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

@NgModule({
  declarations: [
    UsuarioIndexComponent,
    UsuarioLoginComponent,
    UsuarioCreateComponent,
    UsuarioAllComponent,
    UsuarioDialogComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,MatIconModule,
    LayoutModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule, 
    UsuarioRoutingModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule
  ]
})
export class UsuarioModule { }
