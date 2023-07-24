import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { NgxLoadingModule } from 'ngx-loading';
import { FileUploadModule } from 'ng2-file-upload';
import { CreateContractMapRoutingModule } from './create-map-contract-routing.module';
import { CreateMapContractComponent } from './create-map-contract.component';
// import { FileUploader } from 'ng2-file-upload';




@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CreateContractMapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    FileUploadModule,
    NgxPaginationModule,
  
   
  ],
  declarations: [
    // CreateMapContractComponent,
  ]
}) 
export class CreateContractClosedModule { }
