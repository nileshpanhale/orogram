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
import { TradeContractHistoryClosedRoutingModule } from './trade-contract-history-closed-routing.module';
import { TradeContractHistoryClosedComponent } from './trade-contract-history-closed.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    TradeContractHistoryClosedRoutingModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    TradeContractHistoryClosedComponent,
    FilterPipe,
    AddressPipe,
    TradePipe
  ]
})
export class TradeContractHistoryClosedModule { }
