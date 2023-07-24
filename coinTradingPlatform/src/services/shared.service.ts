import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ng-socket-io';

// import { SrvRecord } from 'dns';

@Injectable()
export class SharedService {

	usersecretkeyhash: string;

	public notification = new Subject<any>();

	_user = {};
	token = {};
	phrase = '';

	_credentials: Object;

	constructor( private socket: Socket
	) {
		this.socket.on('newnotification', (data: any) => {
			// console.log("New Notiii",data);
			let user:any = JSON.parse(localStorage.getItem('credentials')).user;
			if((data.userId) && (data.userId != user.userId)){
				data['value'] = 1;
				this.updateNotification(data);
			}
		
		});
	}

	updateNotification(value: any) {
		console.log("updateNotification value: ",value)
		this.notification.next(value);
	}

}