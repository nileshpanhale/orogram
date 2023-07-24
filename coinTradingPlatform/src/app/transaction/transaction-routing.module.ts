import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { TransactionComponent } from './transaction.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'transaction', component: TransactionComponent, data: { title: extract('Admin Transaction') } }
  ])
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TransactionRoutingModule { }
