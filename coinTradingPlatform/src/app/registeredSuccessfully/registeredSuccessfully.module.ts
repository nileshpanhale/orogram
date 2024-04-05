import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RegisteredSuccessfullyRoutingModule } from './registeredSuccessfully-routing.module';
import { RegisteredSuccessfullyComponent } from './registeredSuccessfully.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RegisteredSuccessfullyRoutingModule
  ],
  declarations: [
    RegisteredSuccessfullyComponent
  ]
})
export class RegisteredSuccessfullyModule { }
