import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';

import { MetodoPagoRoutingModule } from './metodo-pago-routing.module';
import { MetodoPagoAllComponent } from './metodo-pago-all/metodo-pago-all.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MetodoPagoFormComponent } from './metodo-pago-form/metodo-pago-form.component';
import { CreditCardNumberDirective } from './credit-card-number.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
// Import the required classes from Angular Material
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NumberFormatDirective } from './numberFormat.directive';


@NgModule({
  declarations: [
    MetodoPagoAllComponent,
    MetodoPagoFormComponent,
    CreditCardNumberDirective,
    NumberFormatDirective
  ],
  imports: [
    MatNativeDateModule,
    MatDatepickerModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MetodoPagoRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatTabsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    NgFor,
    MatSelectModule,
    MatDialogModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Adjust the locale value as needed
  ],
})
export class MetodoPagoModule { }
