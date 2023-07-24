import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { NgxLoadingModule } from 'ngx-loading';
import { FileUploadModule } from 'ng2-file-upload';
import { CreateContractClosedRoutingModule } from './create-contract-closed-routing.module';
import { CreateContractClosedComponent } from './create-contract-closed.component';
// import { FileUploader } from 'ng2-file-upload';



@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateContractClosedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    FileUploadModule,
    NgxPaginationModule,
   
  ],
  declarations: [
    CreateContractClosedComponent,
  ]
})
export class CreateContractClosedModule { }
