import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { SellContractComponent } from './sell-contract.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'sell-contract', component: SellContractComponent, data: { title: extract('Sell Contract') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SellContractRoutingModule { }
