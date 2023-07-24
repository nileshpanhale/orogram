import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { HomePage } from '../home/home';

/**
 * Generated class for the GoogleAuthCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-google-auth-code',
  templateUrl: 'google-auth-code.html',
})
export class GoogleAuthCodePage {
  private googleAuthCode: FormGroup;
  private error = '';
	private emailUnverified:Boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private formBuilder: FormBuilder,
    public menuCtrl: MenuController, 
    private dataService: DataService,
    private userService: UserService
  ) {
    this.menuCtrl.enable(false);
  	this.googleAuthCode = this.formBuilder.group({
      code: [ '' , Validators.compose([Validators.required, Validators.min(2)]) ],
      email: ['']
	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoogleAuthCodePage');
    this.googleAuthCode.patchValue({email: this.navParams.get('email')});
  }

  submitForm() {
    if(!this.googleAuthCode || !this.googleAuthCode.value || this.googleAuthCode.value.code.length == 0 ) {
			this.error = 'Code required';
		} else {
      this.dataService.googleAuth(this.googleAuthCode.value).subscribe( (res: any) => {
        if(res) {
          if(res.user.emailVerified) {
            this.userService.setToken(res.token)
            this.userService.setUserId(res.user.userId);
							this.userService.setUser(res.user);
            this.navCtrl.push(HomePage);
          } else {
            this.emailUnverified = true;
            this.error = 'Your email is not verified. Please verify your email';
          }
        } else {
          this.error = res.error;
        }
      }, error => {
        console.log('error', error);
        this.error = error.error.message || 'Some error occurred';
      });
    }
  }
}
