import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { OtpComponent } from './otp.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'otp', component: OtpComponent, data: { title: extract('Verify OTP') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OtpRoutingModule { }
