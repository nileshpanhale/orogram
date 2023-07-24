import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-otpVerified',
  templateUrl: 'otpVerified.html'
})
export class OtpVerifiedPage {
  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
  	this.menuCtrl.enable(false);
  }
  gotoLogin(e) {
  	this.navCtrl.push(LoginPage);
  }
}
