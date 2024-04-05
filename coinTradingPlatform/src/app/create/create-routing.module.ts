import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CreateComponent } from './create.component';

const routes: Routes = [
  Route.withShell([
    { path: 'create', component: CreateComponent, data: { title: extract('Create Order') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CreateOrderRoutingModule { }
