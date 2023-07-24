import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
// to remove
import { notifications } from '../../mockData/notifications';

@Component({
  selector: 'page-notification',
  templateUrl: 'notificationPage.html'
})
export class NotificationPage {
	private notifications: Array<{
	  type: string,
	  numberOfCoins: number,
	  walletAddress:  string,
	  date: string,
	  customNotification: string
	}>;

	private error: string;

  constructor(public navCtrl: NavController, private dataService: DataService, public menuCtrl: MenuController, private userService: UserService) {
  	this.menuCtrl.enable(true);
  	this.getNotifications();
  }

	getNotifications() {
		this.dataService.getNotifications().subscribe(
			result => {
				this.userService.setNotifications(result);
			},
			error => {
				//to remove
				console.log('mock=', notifications);
				this.userService.setNotifications(notifications);
				this.notifications = this.userService.getNotifications();
				console.log('this.notififications', this.notifications);

				this.error = 'some error occurred, please try later';
			},
			() => {
				this.notifications = this.userService.getNotifications();
				console.log('this.notififications', this.notifications);
			}
		);
	}
}
