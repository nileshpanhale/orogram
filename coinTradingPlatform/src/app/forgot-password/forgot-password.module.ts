import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswdRoutingModule } from './forgot-password-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswdRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ ForgotPasswordComponent,
     ]
})
export class ForgotPasswdModule { }