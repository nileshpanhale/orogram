import { Injectable } from '@angular/core';
import { UserService } from './user.service';
 
@Injectable()
export class UserResponseService {
    url:string;
	userId: string;
	userData: Array<{
		token : {
            tokenType : string,
            accessToken : string,
            refreshToken : string,
            expiresIn : string,
        },
        user: {
            userId : string,
            role : string,
            email : string,
            emailVerified : string,
            isActive : string,
        }
    }>;

    profile = {};

    constructor(public userService:UserService) {}
    
    getTransactions() {
		return this.userData;
	}

	setTransactions(userData) {
		this.userData = userData;
    }
    
    changePc(url) {
        this.url=url;
      }

      getPicValue() {
        return this.url;
      }





      _user = {};

      set user(user:Object) {
		this._user = user;
	}

	get user() {
		// console.log("Get user from user service");
		
		if( this._user ) {		
			return this._user;
		} else {
				this.userService.getUserProfile().subscribe( res => {
				this._user = res;
				return this._user;
			});
		}
	}


}