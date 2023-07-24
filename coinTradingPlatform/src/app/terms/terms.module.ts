import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TermsRoutingModule } from './terms-routing.module';
import {TermsComponent }from'./terms.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    TermsRoutingModule
  ],
  declarations: [
    TermsComponent
  ]
})
export class TermsModule { }
