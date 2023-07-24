import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SanitizerPipe } from './sanitizer.pipe';

import { TwoFactorAuthRoutingModule } from './two-factor-routing.module';
import { TwoFactorComponent } from './two-factor.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    TwoFactorAuthRoutingModule
  ],
  declarations: [
    TwoFactorComponent,
    SanitizerPipe
  ]
})
export class TwoFactorAuthModule { }