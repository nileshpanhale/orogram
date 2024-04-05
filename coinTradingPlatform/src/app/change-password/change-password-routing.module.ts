import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { ChangePasswordComponent } from './change-password.component';

const routes: Routes = [ 
  Route.withShell([
  { path: 'passwd', component: ChangePasswordComponent, data: { title: extract('Change password') } }
])];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],providers: []
})
export class ChangePasswordRoutingModule { }
