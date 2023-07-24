import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { VerifyhashAllComponent } from './verifyhash-open-trade-contract-history.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'verifyhash', component: VerifyhashAllComponent, data: { title: extract('Verify Hash All') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class VerifyhashAllComponentRoutingModule { }
