import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { NgxLoadingModule } from 'ngx-loading';
import { FileUploadModule } from 'ng2-file-upload';
import { CreateContractRoutingModule } from './create-contract-routing.module';
import { CreateContractComponent } from './create-contract.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateContractRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    FileUploadModule,
    NgxPaginationModule
  ],
  declarations: [
    CreateContractComponent,
  ]
})
export class CreateContractModule { }
