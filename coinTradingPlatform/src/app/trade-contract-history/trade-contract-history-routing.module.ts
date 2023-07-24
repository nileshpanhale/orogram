import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { TradeContractHistoryComponent } from './trade-contract-history.component';

const routes: Routes = [
  Route.withShell([
    { path: 'tradecontract', component: TradeContractHistoryComponent, data: { title: extract('Trade History') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TradeContractHistoryRoutingModule { }
