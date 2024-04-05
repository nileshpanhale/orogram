import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { CheckAuthComponent } from './check-auth.component';

const routes: Routes = [
  { path: 'checkAuth', component: CheckAuthComponent, data: { title: extract('Check Auth') } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CheckAuthRoutingModule { }
