import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NotificationPage } from '../notificationPage/notificationPage';

@Component({
  selector: 'notification',
  templateUrl: 'notification.html'
})
export class Notification {
  constructor(public navCtrl: NavController) {
  }
  handleClick(event) {
		this.navCtrl.push(NotificationPage);
	}
}
