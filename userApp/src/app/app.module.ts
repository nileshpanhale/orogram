import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { Notification } from '../pages/notification/notification';
import { NotificationPage } from '../pages/notificationPage/notificationPage';
import { Transaction } from '../pages/transaction/transaction';
import { Settings } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { OtpPage } from '../pages/otp/otp';
import { OtpVerifiedPage } from '../pages/otpVerified/otpVerified';
import { ResendVerifyEmail } from '../pages/resendVerifyEmail/resendVerifyEmail';
import { SendCoin } from '../pages/sendCoin/sendCoin';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from  '@angular/common/http';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { RecaptchaPage } from '../pages/recaptcha/recaptcha';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device/ngx';

import { firebaseConfig } from '../configs/firebaseConfig';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GoogleAuthCodePage } from '../pages/google-auth-code/google-auth-code';
import { QRCodeModule } from 'angular2-qrcode';

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    Notification,
    NotificationPage,
    Transaction,
    Settings,
    LoginPage,
    SignupPage,
    OtpPage,
    OtpVerifiedPage,
    ResendVerifyEmail,
    RecaptchaPage,
    GoogleAuthCodePage,
    SendCoin
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    QRCodeModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    Notification,
    NotificationPage,
    Transaction,
    Settings,
    LoginPage,
    SignupPage,
    OtpPage,
    OtpVerifiedPage,
    ResendVerifyEmail,
    RecaptchaPage,
    GoogleAuthCodePage,
    SendCoin
  ],
  providers: [
    StatusBar,
    Device,
    UniqueDeviceID,
    SplashScreen,
    DataService,
    UserService,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
