import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  Route.withShell([
    { path: 'profile', component: DashboardComponent, data: { title: extract('Dashboard') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule { }
