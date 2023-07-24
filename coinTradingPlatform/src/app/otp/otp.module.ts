import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { OtpRoutingModule } from './otp-routing.module';
import { OtpComponent } from './otp.component';
import { DataService } from '../../services/data.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    OtpRoutingModule,
    FormsModule,                 
    ReactiveFormsModule 
  ],
  declarations: [
    OtpComponent
  ],providers:[DataService]
})
export class OtpModule { }
