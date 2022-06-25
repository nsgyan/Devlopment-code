import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  HttpClientModule,
  HttpClientJsonpModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrintTableComponent } from './print-table/print-table.component';
import { PrintDealComponent } from './print-deal/print-deal.component';
@NgModule({
  declarations: [
    AppComponent,
    PrintTableComponent,
    PrintDealComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
