import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CreateContractComponent } from './create-contract.component';

const routes: Routes = [
  Route.withShell([
    { path: 'create-contract', component: CreateContractComponent, data: { title: extract('Create Contract') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CreateContractRoutingModule { }
