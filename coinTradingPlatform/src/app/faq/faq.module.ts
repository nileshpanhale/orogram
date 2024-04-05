import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {FaqComponent} from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,                 
    ReactiveFormsModule  ,
    FaqRoutingModule
  ],
  declarations: [FaqComponent], providers: [DataService
  ]
})
export class FaqModule { }
