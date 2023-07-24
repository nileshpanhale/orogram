import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { EditProfileComponent } from './editProfile.component';

const routes: Routes = [
  Route.withShell([
    { path: 'editProfile', component: EditProfileComponent, data: { title: extract('Edit Profile') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EditProfileRoutingModule { }
