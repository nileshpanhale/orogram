import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,                 
    ReactiveFormsModule  ,
    ContactRoutingModule
  ],
  declarations: [
    ContactComponent,
    ],
    providers: [DataService
    ]
})
export class ContactModule {
 
 }
