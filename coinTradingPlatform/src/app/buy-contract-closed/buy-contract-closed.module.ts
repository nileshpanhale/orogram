import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { SearchPipe } from '../searchPipe';
// import { FilterPipe } from './status.filter';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { FileUploadModule } from 'ng2-file-upload';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DatePipe } from './datePipe';
import { NgxLoadingModule } from 'ngx-loading';

import { FilterPipe } from './status.filter';
import { BuyContractClosedRoutingModule } from './buy-contract-closed-routing.module';
import { BuyContractClosedComponent } from './buy-contract-closed.component';
import baseurl from '../../../../AdminIdChat';

// const config: SocketIoConfig = { url: 'http://n4.iworklab.com:4013' , options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    BuyContractClosedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FileUploadModule,
    TypeaheadModule.forRoot(),
    SocketIoModule.forRoot(config),
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [
    BuyContractClosedComponent,
    DatePipe,
    FilterPipe,
  ],
  providers: [SearchPipe]
})
export class BuyContractClosedModule { }
