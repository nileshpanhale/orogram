import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { BuyContractComponent } from './buy-contract.component';

const routes: Routes = [
  Route.withShell([
    { path: 'buy-contract', component: BuyContractComponent, data: { title: extract('Buy Contract') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BuyContractRoutingModule { }
