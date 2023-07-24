import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { RegisteredSuccessfullyComponent } from './registeredSuccessfully.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'success', component: RegisteredSuccessfullyComponent, data: { title: extract('Registered successfully') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RegisteredSuccessfullyRoutingModule { }
