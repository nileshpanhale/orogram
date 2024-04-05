import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password.component';
import { UserService } from 'services/user.service';
import { CheckSecretKeyService } from 'services/checksecretKey.service';
@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    TranslateModule,
    FormsModule,                 
    ReactiveFormsModule 
  ],
  declarations: [ChangePasswordComponent],providers:[UserService,CheckSecretKeyService]
})
export class ChangePasswordModule { }
