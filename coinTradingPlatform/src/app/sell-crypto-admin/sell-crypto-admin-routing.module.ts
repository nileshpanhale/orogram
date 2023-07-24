import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { SellcryptoAdminComponent } from './sell-crypto-admin.component';

const routes: Routes = [
  Route.withShell([
    { path: 'sellCryptoAdmin', component:SellcryptoAdminComponent , data: { title: extract('purchaseCrypto') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellcryptoadminRoutingModule { }
