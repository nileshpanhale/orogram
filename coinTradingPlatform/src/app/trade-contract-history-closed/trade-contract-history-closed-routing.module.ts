import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { TradeContractHistoryClosedComponent } from './trade-contract-history-closed.component';

const routes: Routes = [
  Route.withShell([
    { path: 'tradecontractclosed', component: TradeContractHistoryClosedComponent, data: { title: extract('Closed Contract History') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TradeContractHistoryClosedRoutingModule { }
