import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

// import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaModule } from 'ng-recaptcha';


@NgModule({
  imports: [
    RecaptchaModule.forRoot(), 
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    // RecaptchaFormsModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
