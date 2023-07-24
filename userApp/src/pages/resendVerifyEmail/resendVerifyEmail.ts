import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LoginPage } from '../login/login';
import configs from '../../configs/platform';

@Component({
  selector: 'resendVerifyEmail',
  templateUrl: 'resendVerifyEmail.html'
})
export class ResendVerifyEmail {
  private verify: FormGroup;
  private error = '';
  private message = false;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public menuCtrl: MenuController, private dataService: DataService) {
	  	this.menuCtrl.enable(false);
	  	this.verify = this.formBuilder.group({
	  		email: ['', Validators.compose([Validators.required, Validators.min(3), Validators.email]) ],
	  	});
	}
	submitForm() {
		if(!this.verify || !this.verify.value || this.verify.value.email.length == 0 ) {
			this.error = 'Email required';
		}
		if(this.error.length == 0) {
			this.verify.value['platform'] = configs.platformName;
			this.dataService.resendVerificationEmail(this.verify.value).subscribe(
				(result:any) => {
					if(result) {
						this.message = true;
					} else {
						this.error = result.error;
					}
				},
				error => {
					this.error = 'Some error occurred, Please try again in later';
				}
				)
		}
	}

	gotoLoginPage(e) {
		this.navCtrl.push(LoginPage);
	}
}
