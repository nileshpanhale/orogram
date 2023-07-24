import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';

import { SuccessfullpaymentComponent } from './successfullpayment.component';
const routes: Routes = [ Route.withShell([
    { path: 'paymentsucess', component: SuccessfullpaymentComponent, data: { title: extract('Payment successfully') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],providers: []
})
export class SuccessfullpaymentRoutingModule { }
