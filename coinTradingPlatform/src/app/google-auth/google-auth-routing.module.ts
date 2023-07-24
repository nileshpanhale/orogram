import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { GoogleAuthComponent } from './google-auth.component';

const routes: Routes = [
  
    { path: 'googleAuth', component: GoogleAuthComponent, data: { title: extract('Google Auth') } }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class GoogleAuthRoutingModule { }
