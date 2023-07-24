import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleAuthCodePage } from './google-auth-code';

@NgModule({
  declarations: [
    GoogleAuthCodePage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleAuthCodePage),
  ],
})
export class GoogleAuthCodePageModule {}
