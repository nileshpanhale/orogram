import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasecryptoRoutingModule } from './purchasecrypto-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from "angular-6-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';


import { FilterPipe } from './status.filter';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module


import { PurchasecryptoComponent } from './purchasecrypto.component';

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };


@NgModule({
  imports: [
    CommonModule,
    PurchasecryptoRoutingModule,
    TranslateModule,
    DataTableModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  declarations: [PurchasecryptoComponent,
    FilterPipe]
})
export class PurchasecryptoModule { }