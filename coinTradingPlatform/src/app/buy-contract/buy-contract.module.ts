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
import { DatePipe } from './datePipe'
import { FilterPipe } from './status.filter';
import { NgxLoadingModule } from 'ngx-loading';
import { BuyContractRoutingModule } from './buy-contract-routing.module';
import { BuyContractComponent } from './buy-contract.component';
// import baseurl from '../../../../AdminIdChat';
import { environment } from '../../environments/environment'

// const config: SocketIoConfig = { url: 'http://n4.iworklab.com:4013' , options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    BuyContractRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FileUploadModule,
    TypeaheadModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    BuyContractComponent,
    DatePipe,
    FilterPipe,
  ],
  providers: [SearchPipe]
})
export class BuyContractModule { }
