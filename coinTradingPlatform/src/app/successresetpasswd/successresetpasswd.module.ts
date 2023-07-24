import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessresetpasswdRoutingModule } from './successresetpasswd-routing.module';
import { SuccessresetpasswdComponent } from './successresetpasswd.component';
@NgModule({
  imports: [
    CommonModule,TranslateModule,
    SuccessresetpasswdRoutingModule
  ],
  declarations: [SuccessresetpasswdComponent]
})
export class SuccessresetpasswdModule { }
