import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { NgxLoadingModule } from 'ngx-loading';
// import { FilterPipe } from './status.filter';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { FileUploadModule } from 'ng2-file-upload';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FilterPrice } from './filterPrice';
import { DatePipe } from './datePipe'
import { FilterPipe } from './status.filter';
import { SellContractClosedRoutingModule } from './sell-contract-closed-routing.module'
import { SellContractClosedComponent } from './sell-contract-closed.component';
import baseurl from '../../../../AdminIdChat';



// const config: SocketIoConfig = { url: 'http://n4.iworklab.com:4013', options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server



@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SellContractClosedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TypeaheadModule.forRoot(),
    FileUploadModule,
    SocketIoModule.forRoot(config),
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    SellContractClosedComponent,
    FilterPrice,
    DatePipe,
    FilterPipe
  ]
})
export class SellContractClosedModule { }
