import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { NgxLoadingModule } from 'ngx-loading';
import { CreateOrderRoutingModule } from './create-routing.module';
import { CreateComponent } from './create.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    FileUploadModule,
    NgxPaginationModule
  ],
  declarations: [
    CreateComponent,
  ]
})
export class CreateOrderModule { }
