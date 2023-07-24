import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessfullpaymentRoutingModule } from './successfullpayment-routing.module';
import { SuccessfullpaymentComponent } from './successfullpayment.component';


@NgModule({
  imports: [
    CommonModule,TranslateModule,
    SuccessfullpaymentRoutingModule
  ],
  declarations: [SuccessfullpaymentComponent]
})
export class SuccessfullpaymentModule { }
