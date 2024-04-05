import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { TradeHistoryComponent } from './trade-history.component';

const routes: Routes = [
  Route.withShell([
    { path: 'trade', component: TradeHistoryComponent, data: { title: extract('Trade History') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TradeHistoryRoutingModule { }
