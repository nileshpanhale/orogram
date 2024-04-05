import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { BuyCryptoComponent } from './buy-crypto.component';

const routes: Routes = [
  Route.withShell([
    { path: 'buy', component: BuyCryptoComponent, data: { title: extract('Buy Crypto') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BuyCryptoRoutingModule { }
