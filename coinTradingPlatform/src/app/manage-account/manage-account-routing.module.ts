import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { ManageAccountComponent } from './manage-account.component';

const routes: Routes = [
  Route.withShell([
    { path: 'manage', component: ManageAccountComponent, data: { title: extract('Manage') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ManageAccountRoutingModule { }
