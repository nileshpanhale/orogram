import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { Socket } from 'ng-socket-io';

// import { SrvRecord } from 'dns';

@Injectable()
export class UserService {

	usersecretkeyhash: string;

	public notification = new Subject<any>();

	_user = {};
	token = {};
	phrase = '';

	_credentials: Object;

	constructor(
		private dataService: DataService, private socket: Socket
	) {

		this.socket.on('newnotification', (data: any) => {
			// console.log("I'm inside user of user service: " , data );
			let user:any = this.user
			if(data.userId != user.userId){
				data['value'] = 1;
				this.updateNotification(data);
			}
		});
	}

	getusersecretkeyhash() {
		return this.usersecretkeyhash;
	}

	setusersecretkeyhash(usersecretkeyhash: string) {
		this.usersecretkeyhash = usersecretkeyhash;
	}

	/**
	 * Sets the user credentials.
	 * The credentials may be persisted across sessions by setting the `remember` parameter to true.
	 * Otherwise, the credentials are only persisted for the current session.
	 * @param {Credentials=} credentials The user credentials.
	 * @param {boolean=} remember True to remember credentials across sessions.
	 */
	// set credentials(credentials) {
	// 	localStorage.setItem(vars.credentialsKey, JSON.stringify(credentials));    
	// 	this._credentials = credentials;
	// }

	/**
	 * Gets the user credentials.
	 * @return {Credentials} The user credentials or null if the user is not authenticated.
	 */
	// get credentials(): Object  {		
	// 	return this._credentials ? this._credentials: JSON.parse( localStorage.getItem(vars.credentialsKey) );
	// }

	set user(user: Object) {
		this._user = user;
	}

	get user() {
		// console.log("Get user from user service");

		if (this._user) {
			return this._user;
		} else {
			this.dataService.getUserProfile().subscribe(res => {
				this._user = res;
				return this._user;
			});
		}
	}

	getUsername(): string | null {
		return this.user['firstName'] + ' ' + this.user['lastName'];
	}


	updateNotification(value: any) {
		this.notification.next(value);
	}

}