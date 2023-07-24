import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class Settings {
	private pushNotificationStatus: boolean = false;
	private emailNotificationStatus: boolean = false;

  constructor(public navCtrl: NavController, private dataService: DataService, public toastCtrl: ToastController, private userService: UserService, private storage: Storage) {

  }

  pushNotificationChange() {
  	console.log('hhhhhh');
  	this.dataService.setPushNotificationStatus({ status: this.pushNotificationStatus }).subscribe(
  		res => {
  			const toast = this.toastCtrl.create({
			      message: 'push notification status changed successfully',
			      duration: 3000
			    });
			    toast.present();
  		},
  		err => {
  			const toast = this.toastCtrl.create({
			      message: 'some error occurred',
			      duration: 3000
			    });
			    toast.present();
  		}
  	);
  }

  emailNotificationChange() {
  	this.dataService.setEmailNotificationStatus({ status: this.emailNotificationStatus }).subscribe(
  		res => {
  			const toast = this.toastCtrl.create({
			      message: 'email notification status changed successfully',
			      duration: 3000
			    });
			    toast.present();
  		},
  		err => {
  			const toast = this.toastCtrl.create({
			      message: 'some error occurred',
			      duration: 3000
			    });
			    toast.present();
  		}
  	);
  }

  logout() {
		this.storage.clear();
  	this.userService.setUserId(null);
  	this.navCtrl.push(LoginPage);
  }

}
