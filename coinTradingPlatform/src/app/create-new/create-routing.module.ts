import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { CreateNewComponent } from './create.component';

const routes: Routes = [
  Route.withShell([
    { path: 'create-new', component: CreateNewComponent, data: { title: extract('Create Order') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CreateNewOrderRoutingModule { }
