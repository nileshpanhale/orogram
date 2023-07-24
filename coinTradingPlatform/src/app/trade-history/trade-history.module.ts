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

import { TradeHistoryRoutingModule } from './trade-history-routing.module';
import { TradeHistoryComponent } from './trade-history.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    TradeHistoryRoutingModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    TradeHistoryComponent,
    FilterPipe,
    AddressPipe,
    TradePipe
  ]
})
export class TradeHistoryModule { }
