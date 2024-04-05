import { NgModule } from '@angular/core';
import { Routes, RouterModule, } from '@angular/router';
import { EarthMapComponent } from './earth-map/earth-map.component';
import { Route, extract } from '@app/core';
import { CreateMapContractComponent } from './create-map-contract/create-map-contract.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  // { path: 'earth-map', component: EarthMapComponent, },
  { path: 'earth-map', component: EarthMapComponent, data: { title: extract('earth-map') } },
  { path: 'map-contract', component: CreateMapContractComponent, data: { title: extract('map-contract') } },

  // Route.withShell([
  // ]),
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
