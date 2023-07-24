import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FilterPipe } from './status.filter';

import { ManageAccountRoutingModule } from './manage-account-routing.module';
import { ManageAccountComponent } from './manage-account.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ManageAccountRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ManageAccountComponent
  ]
})
export class ManageAccountModule { }
