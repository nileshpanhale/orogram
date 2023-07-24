import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { BuyContractClosedComponent } from './buy-contract-closed.component';

const routes: Routes = [
  Route.withShell([
    { path: 'buy-contract-closed', component: BuyContractClosedComponent, data: { title: extract('Buy Contract Closed') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BuyContractClosedRoutingModule { }
