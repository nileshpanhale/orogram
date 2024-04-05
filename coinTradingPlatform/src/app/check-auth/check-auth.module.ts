import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { CheckAuthRoutingModule } from './check-auth-routing.module';
import { CheckAuthComponent } from './check-auth.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    CheckAuthRoutingModule
  ],
  declarations: [
    CheckAuthComponent
  ]
})
export class CheckAuthModule { }
