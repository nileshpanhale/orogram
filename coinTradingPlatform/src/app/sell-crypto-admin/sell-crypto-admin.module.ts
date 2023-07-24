import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellcryptoadminRoutingModule } from './sell-crypto-admin-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule } from "angular-6-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxLoadingModule } from 'ngx-loading';


import { FilterPipe } from './status.filter';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module


import { SellcryptoAdminComponent } from './sell-crypto-admin.component';

const config: SocketIoConfig = { url: 'https://server.orogram.io', options: {} };


@NgModule({
  imports: [
    CommonModule,
    SellcryptoadminRoutingModule,
    TranslateModule,
    DataTableModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    SocketIoModule.forRoot(config)
  ],
  declarations: [SellcryptoAdminComponent,
    FilterPipe]
})
export class SellcryptoAdminModule { }