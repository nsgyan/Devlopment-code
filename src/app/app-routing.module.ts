import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintDealComponent } from './print-deal/print-deal.component';
import { PrintTableComponent } from './print-table/print-table.component';

const routes: Routes = [
    { path: 'view-quote/:id', component: PrintTableComponent },
    { path: 'view-deal/:id', component: PrintDealComponent },
  ]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
