import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { SearchPipe } from '../searchPipe';
// import { FilterPipe } from './status.filter';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxLoadingModule } from 'ngx-loading';

import { FilterPrice } from './filterPrice';
import { FilterPipe } from './status.filter';
import { BuyCryptoRoutingModule } from './buy-crypto-routing.module';
import { BuyCryptoComponent } from './buy-crypto.component';
import baseurl from '../../../../AdminIdChat';

// const config: SocketIoConfig = { url:'http://n4.iworklab.com:4013', options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    BuyCryptoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
    SocketIoModule.forRoot(config),
    NgxExtendedPdfViewerModule
  ],
  declarations: [
    BuyCryptoComponent,
    FilterPrice,
    FilterPipe,
  ],
  providers: [SearchPipe]
})
export class BuyCryptoModule {

  constructor() {
    console.log("basedfdfg", baseurl);
  }

}
