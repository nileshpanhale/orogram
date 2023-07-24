import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { SendTokensComponent } from './send-tokens.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'send-tokens', component: SendTokensComponent, data: { title: extract('Send Tokens') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SendTokensRoutingModule { }
