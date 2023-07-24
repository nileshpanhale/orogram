import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

import { SendTokensRoutingModule } from './send-tokens-routing.module'
import { SendTokensComponent } from './send-tokens.component';
import { SearchPipe } from './searchFilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    SendTokensRoutingModule,

  ],
  declarations: [
    SearchPipe,
    SendTokensComponent,
  ]
})

export class SendTokensModule { }
