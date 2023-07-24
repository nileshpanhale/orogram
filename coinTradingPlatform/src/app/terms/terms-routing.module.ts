import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Route, extract } from '@app/core';
import { TermsComponent } from './terms.component';

const routes: Routes = [
  Route.withoutShell([
    { path: 'terms', component: TermsComponent, data: { title: extract('Terms') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TermsRoutingModule { }
