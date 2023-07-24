import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
// import { FilterPipe } from './status.filter';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxLoadingModule } from 'ngx-loading';
import { FilterPrice } from './filterPrice';
import { FilterPipe } from './status.filter';
import { SellCryptoRoutingModule } from './sell-crypto-routing.module'
import { SellCryptoComponent } from './sell-crypto.component';
import { environment } from '../../environments/environment'

// const config: SocketIoConfig = { url: 'http://n4.iworklab.com:4013' , options: {} };

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };        // Client Server

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SellCryptoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    SellCryptoComponent,
    FilterPrice,
    FilterPipe
  ]
})
export class SellCryptoModule { }
