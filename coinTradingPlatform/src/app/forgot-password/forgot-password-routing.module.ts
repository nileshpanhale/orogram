import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'forgot', component:ForgotPasswordComponent , data: { title: extract('Forgot Password') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswdRoutingModule { }
