import { Injectable } from '@angular/core';

@Injectable()
export class CheckSecretKeyService {
	usersecretkeyValue: boolean;



	constructor() {}

	getusersecretkeyValue() {
		return this.usersecretkeyValue;
	}
	
	setusersecretkeyValue(usersecretkeyValue:boolean) {
		this.usersecretkeyValue = usersecretkeyValue;
	}

	

}