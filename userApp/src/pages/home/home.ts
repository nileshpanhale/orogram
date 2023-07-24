import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { LoginPage } from '../login/login';
import {QRCodeComponent} from 'angular2-qrcode';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
	private profile: any;

  constructor(public navCtrl: NavController, private userService: UserService, private dataService: DataService, public menuCtrl: MenuController) {
  	this.menuCtrl.enable(true);
  	this.profile = this.userService.getProfile() || { currentAccountBalance: 0, walletAddress: '678253618273', unreadNotificationCount: 0 };
  	if(Object.keys(this.profile).length == 0) {
  		this.getUserData();
  	}
  }

  getUserData() {
  	const userId = this.userService.getUserId();
  	console.log('userId', userId);
    if(userId && userId.length >= 0) {
	  	this.dataService.getAccount().subscribe(
	  		(result:any) => {
					console.log(result, "result");
					if(result.success) {
						this.userService.setWalletAddress(result.account.address);
						this.profile = result.account;
						console.log(this.profile, "profile");
						
					}
	  		},
	  		error => {
	  			//to remove
	  			this.profile = {
	  				currentAccountBalance: 256333,
	  				walletAddress: '678253618273',
	  				unreadNotificationCount: 10
	  			}
	  		}
	  	);
	  } else {
	  	this.navCtrl.push(LoginPage);
	  }
  }
}
