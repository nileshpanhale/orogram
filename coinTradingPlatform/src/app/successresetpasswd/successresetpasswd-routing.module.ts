import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { SuccessresetpasswdComponent } from './successresetpasswd.component';
const routes: Routes = [

  Route.withShell([
    { path: 'passwdreset', component: SuccessresetpasswdComponent, data: { title: extract('Password Reset successfully') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuccessresetpasswdRoutingModule { }
