import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { PurchasecryptoComponent } from './purchasecrypto.component';

const routes: Routes = [
  Route.withShell([
    { path: 'purchaseCrypto', component:PurchasecryptoComponent , data: { title: extract('purchaseCrypto') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasecryptoRoutingModule { }
