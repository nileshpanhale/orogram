import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { DataService } from '../../services/data.service';
import { UserService } from 'services/user.service';
import { RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SignupRoutingModule,
    FormsModule,     
    RecaptchaModule.forRoot(),            
    ReactiveFormsModule  
  ],
  declarations: [SignupComponent],
  providers: [DataService,UserService
  ],
})
export class SignupModule { }
