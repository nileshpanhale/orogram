import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { SellCryptoComponent } from './sell-crypto.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'sell', component: SellCryptoComponent, data: { title: extract('Sell Crypto') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SellCryptoRoutingModule { }
