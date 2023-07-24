import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileViewRoutingModule } from './profileView-routing.module';
import { ProfileViewComponent } from './profileView.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ProfileViewRoutingModule
  ],
  declarations: [
    ProfileViewComponent
  ]
})
export class ProfileViewModule { }
