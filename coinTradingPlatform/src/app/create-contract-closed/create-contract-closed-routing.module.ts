import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CreateContractClosedComponent } from './create-contract-closed.component';

const routes: Routes = [
  Route.withShell([
    { path: 'create-contract-closed', component: CreateContractClosedComponent, data: { title: extract('Create Closed Contract') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CreateContractClosedRoutingModule { }
