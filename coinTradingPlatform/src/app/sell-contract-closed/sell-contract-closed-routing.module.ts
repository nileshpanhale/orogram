import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { SellContractClosedComponent } from './sell-contract-closed.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'sell-contract-closed', component: SellContractClosedComponent, data: { title: extract('Sell Contract closed') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SellContractClosedRoutingModule { }
