import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { TwoFactorComponent } from './two-factor.component';

const routes: Routes = [
  Route.withShell([
    { path: 'factorAuth', component: TwoFactorComponent, data: { title: extract('Factor Auth') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TwoFactorAuthRoutingModule { }