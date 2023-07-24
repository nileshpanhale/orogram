import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { WalletComponent } from './wallet.component';

const routes: Routes = [
  Route.withShell([
    { path: 'wallet', component: WalletComponent, data: { title: extract('Wallet') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WalletRoutingModule { }