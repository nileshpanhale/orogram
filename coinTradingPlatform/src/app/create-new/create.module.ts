import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

import { CreateNewOrderRoutingModule } from './create-routing.module';
import { CreateNewComponent } from './create.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateNewOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [
    CreateNewComponent,
  ]
})
export class CreateNewOrderModule { }
