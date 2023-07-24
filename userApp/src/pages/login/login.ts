import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service';

import { HomePage } from '../home/home';
import { UserService } from '../../services/user.service';
import { SignupPage } from '../signup/signup';
import { ResendVerifyEmail } from '../resendVerifyEmail/resendVerifyEmail';
import { GoogleAuthCodePage } from '../google-auth-code/google-auth-code';
import urls from '../../configs/urls';
// import { Device } from '@ionic-native/device/ngx';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
	private login: FormGroup;
	private error = '';
	private emailUnverified:Boolean = false;
	public isFirstTimeLogin:Boolean = false;
	public deviceId = "DVC0077";


  constructor(
	  public navCtrl: NavController, 
	  private formBuilder: FormBuilder, 
	  public menuCtrl: MenuController, 
	  private dataService: DataService, 
	  private userService: UserService,
	  private storage: Storage
	) {
		this.menuCtrl.enable(false);
		this.login = this.formBuilder.group({
			email: ['', Validators.compose([Validators.required, Validators.min(3), Validators.email],) ],
			password: ['', Validators.compose([Validators.required, Validators.min(3), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]) ],
			passphrase: ['', Validators.compose([],) ],
		});

		console.log('device');
		// document.addEventListener("deviceready", onDeviceReady, false);
		// 	function onDeviceReady() {
		// 	console.log('In second',device.platform);
	
		// }
		

		// console.log('Device UUID is: ' + this.uniqueDeviceID);


		//getting device id ---------------------
		// this.uniqueDeviceID.get()
  		// 	.then((uuid: any) => console.log(uuid))
  		// 	.catch((error: any) => console.log(error));
		

		storage.get('token').then( (val) => {
			
			
			if( val ) {
				this.userService.setToken(val);
				this.dataService.getProfile().subscribe( response => {
					this.userService.setUser(response);
					this.userService.setUserId(response['userId']);
					this.navCtrl.push(HomePage);
				});
			} 
		});
		storage.get('user1').then( (val) => {
			if( val ) {

			}
		})
	}

	gotoSignup(e) {
	  	this.navCtrl.push(SignupPage);
	}

	gotoVerifyEmailPage(e) {
		this.navCtrl.push(ResendVerifyEmail);
	}

	submitForm() {

		if(!this.login || !this.login.value || !this.login.value.email || !this.login.value.password ) {
			this.error = 'Email or Password invalid';
		}
		let payload = {
			email : this.login.value.email ,
			password : this.login.value.password,
			deviceId : this.deviceId,
			mobileCall : true
		}
		console.log('Paylode',payload);
			this.dataService.login(payload).subscribe(
				(result:any) => {
					console.log('result', result);

					if(result.message == "New Device Found"){

						this.isFirstTimeLogin = true

					}


					if( result.googleAuth ) {
						console.log("Navigating to purchase page");
						this.navCtrl.push(GoogleAuthCodePage, {email: this.login.value.email});
						// this.router.navigate(['/googleAuthCode', this.loginForm.value['email']], { replaceUrl: true });
					  }
					if(result) {
						if(result.user.emailVerified) {
							this.userService.setToken(result.token)
							this.userService.setUserId(result.user.userId);
							if(result.user['picture']) {
								result.user['picture'] = urls.baseUrl + '/assets/images/' + result.user['picture'];
							}
							this.userService.setUser(result.user);
							// Inserting user info in mobile storage
							this.storage.set('token', result.token);
							this.storage.set('user', result.user);

							console.log(this.userService.getToken(), this.userService.getUserId(), "------------at home");
							this.navCtrl.push(HomePage);
						} else {
							this.emailUnverified = true;
							this.error = 'Your email is not verified. Please verify your email';
						}
					} else {
						this.error = result.error;
					}
				},
				error => {
					console.log('error', error);
					this.error = error.error.message || 'Some error occurred';
				}
				)
		
	}
}
