import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
// import { FilterPipe } from './status.filter';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { FileUploadModule } from 'ng2-file-upload';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FilterPrice } from './filterPrice';
import { FilterPipe } from './status.filter';
import { DatePipe } from './datePipe'
import { NgxLoadingModule } from 'ngx-loading';
import { SellContractRoutingModule } from './sell-contract-routing.module'
import { SellContractComponent } from './sell-contract.component';
import { environment } from '../../environments/environment'

// const config: SocketIoConfig = { url:'http://n4.iworklab.com:4013' , options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SellContractRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TypeaheadModule.forRoot(),
    FileUploadModule,
    NgxLoadingModule.forRoot({}),
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    SellContractComponent,
    FilterPrice,
    DatePipe,
    FilterPipe
  ]
})
export class SellContractModule { }
