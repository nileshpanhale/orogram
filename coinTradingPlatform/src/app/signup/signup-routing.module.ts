import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';

import { SignupComponent } from './signup.component';

const routes: Routes = [  Route.withoutShell([
  { path: 'signup', component: SignupComponent, data: { title: extract('SignUp') } }
])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SignupRoutingModule { }
