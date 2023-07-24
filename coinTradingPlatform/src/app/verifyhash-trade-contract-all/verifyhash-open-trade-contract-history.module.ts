import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { FilterPipe } from './status.filter';
import { AddressPipe } from './address.filter';
import { TradePipe } from './tradetType.filter';

import { VerifyhashAllComponentRoutingModule } from './verifyhash-open-trade-contract-history-routing.module';
import { VerifyhashAllComponent } from './verifyhash-open-trade-contract-history.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    VerifyhashAllComponentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [
    VerifyhashAllComponent,
    FilterPipe,
    AddressPipe,
    TradePipe
  ]
})
export class VerifyhashAllModule { }
