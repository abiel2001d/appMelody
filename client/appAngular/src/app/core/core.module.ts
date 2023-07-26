import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoadingPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoadingPageComponent
  ]
})
export class CoreModule { }
