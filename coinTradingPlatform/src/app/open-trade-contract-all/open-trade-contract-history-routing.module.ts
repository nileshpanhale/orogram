import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { TradeContractHistoryAllComponent } from './open-trade-contract-history.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'tradecontractall', component: TradeContractHistoryAllComponent, data: { title: extract('Contract History All') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TradeContractHistoryAllRoutingModule { }
