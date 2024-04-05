import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { OtpPage } from '../otp/otp';

/**
 * Generated class for the RecaptchaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recaptcha',
  templateUrl: 'recaptcha.html',
})



export class RecaptchaPage {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
	phoneNumber;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public toastCtrl: ToastController) {
		this.phoneNumber = "+" + parseInt(this.navParams.get('mobile'));

		this.platform.ready().then(() => {
			document.addEventListener('backbutton', () => {
				console.log("cannot go back")
			}, false);
			});
  }

  ionViewDidLoad() {
		this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');		
  }

  ionViewWillEnter() {
		let self = this;
    firebase.auth().signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier).then( confirmationResult => {
			this.navCtrl.push(OtpPage, { verificationid: confirmationResult.verificationId, phone: this.phoneNumber });
		})
		.catch(function (error) {
			let toast = self.toastCtrl.create({
				message: 'Cannot Send sms! ' + error.code,
				duration: 1000,
				position: 'top'
			});
			toast.present();
			console.error("SMS not sent", error.code);
		});
	}
	
}
