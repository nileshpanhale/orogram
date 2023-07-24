import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecaptchaPage } from './recaptcha';

@NgModule({
  declarations: [
    RecaptchaPage,
  ],
  imports: [
    IonicPageModule.forChild(RecaptchaPage),
  ],
})
export class RecaptchaPageModule {}
