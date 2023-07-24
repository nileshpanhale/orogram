import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { FilterPipe } from './status.filter';
import { AddressPipe } from './address.filter';
import { TradePipe } from './tradetType.filter';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxLoadingModule } from 'ngx-loading';

import { TradeContractHistoryRoutingModule } from './trade-contract-history-routing.module';
import { TradeContractHistoryComponent } from './trade-contract-history.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    TradeContractHistoryRoutingModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),

  ],
  declarations: [
    TradeContractHistoryComponent,
    FilterPipe,
    AddressPipe,
    TradePipe
  ]
})
export class TradeContractHistoryModule { }
