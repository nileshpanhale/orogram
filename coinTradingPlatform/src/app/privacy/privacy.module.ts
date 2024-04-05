import { PrivacyComponent } from './privacy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyRoutingModule } from './privacy-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PrivacyRoutingModule,
  ],
  declarations: [    PrivacyComponent
  ]
})
export class PrivacyModule { }
