import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { FilterPipe } from './filterpipe';
import { FilterUser } from './filterType';
import { FilterStatus } from './filterStatus';
// import { SearchPipe } from './transaction/search.pipe';
import { SearchPipe } from './searchFilter.pipe';



import { TransactionComponent } from './transaction.component';
import { TransactionRoutingModule } from './transaction-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TransactionRoutingModule
  ],
  declarations: [TransactionComponent,
    FilterPipe,
    FilterUser,
    FilterStatus,
    SearchPipe
  ]
})
export class TransactionModule { }
