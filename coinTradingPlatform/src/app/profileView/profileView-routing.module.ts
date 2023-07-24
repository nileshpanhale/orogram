import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { ProfileViewComponent } from './profileView.component';

const routes: Routes = [
  Route.withShell([
    { path: 'dashboard', component: ProfileViewComponent, data: { title: extract('Profile') } }
  ])
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileViewRoutingModule { }
