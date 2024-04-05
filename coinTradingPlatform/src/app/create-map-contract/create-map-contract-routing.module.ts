import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard, Route, extract } from '@app/core';
import { CreateMapContractComponent } from './create-map-contract.component';
import { ShellComponent } from '@app/core/shell/shell.component';

const routes: Routes = [
  // {
  //   path:'abc',
  //   component:ShellComponent,
  //   children:[
  //     {
  //       path:'create-map-contract',
  //       component: CreateMapContractComponent,
  //       data: { reuse: true },
         

  //     }
  //   ],
  //   canActivate: [AuthenticationGuard],
  // }
//   Route.withShell([
//     { path: 'createMap', component: CreateMapContractComponent, data: { title: extract('createMap') } }
//   ])
];

@NgModule({
  // imports: [RouterModule.forChild(routes)],
  // exports: [RouterModule],
  providers: []

})
export class CreateContractMapRoutingModule { }
