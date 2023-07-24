import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GoogleAuthRoutingModule } from './google-auth-routing.module';
import { GoogleAuthComponent } from './google-auth.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    GoogleAuthRoutingModule
  ],
  declarations: [
    GoogleAuthComponent
  ]
})
export class GoogleAuthModule { }
