import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase';

import { DataService } from '../../services/data.service';
import { OtpVerifiedPage } from '../otpVerified/otpVerified';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage {
	private otp: FormGroup;
	private error = '';
	verificationId;
  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public menuCtrl: MenuController, private dataService: DataService, public navParams: NavParams) {
  	this.menuCtrl.enable(false);
  	this.otp = this.formBuilder.group({
  		otp: [ '' , Validators.compose([Validators.required, Validators.min(2)]) ]
	  });
	  
	this.verificationId = this.navParams.get('verificationid');
	}
	submitForm() {
		if(!this.otp || !this.otp.value || this.otp.value.otp.length == 0 ) {
			this.error = 'OTP required';
		}
		if(this.error.length == 0) {
			let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.otp.value.otp);
			firebase.auth().signInWithCredential(signInCredential).then((info) => { 
				let profile = {
					mobileVerified: true
				}
				this.dataService.modifyProfile(profile).subscribe( response => {
					this.navCtrl.push(LoginPage);
				})
			}, (err) => {
				this.error = 'error.message';
				console.log(err, "error from google");
			});
		}

	
	}
}
