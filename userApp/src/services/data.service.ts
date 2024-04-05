import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import urls from '../configs/urls';

import { UserService } from './user.service';
// import { NavController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DataService {
  private headersWithToken;
  constructor(private httpClient : HttpClient, private userService: UserService) { 
    console.log('urls', urls);
    
  }

  register(fields) {
  	const formFields = JSON.stringify(fields);
  	return this.httpClient.post(`${urls.baseUrl}${urls.register}`, formFields, httpOptions);
  }
  
  login(userId) {
  	const formFields = JSON.stringify(userId);
  	return this.httpClient.post(`${urls.baseUrl}${urls.login}`, formFields, httpOptions); 
  }

  verifyOtp(otp) {
  	const formFields = JSON.stringify(otp);
    console.log('here', otp);
  	return this.httpClient.post(`${urls.baseUrl}${urls.verifyOtp}`, formFields, httpOptions);
  }

  getAccount() {
    let token = this.userService.getToken();
    console.log(token['tokenType']+ ' ' +token['accessToken'], "token------>");
    
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
  	return this.httpClient.get(`${urls.baseUrl}${urls.getAccount}`, {headers: headers});
  }
  
  getTransactions() {
    return this.httpClient.get(`${urls.baseUrl}${urls.getTransactions}`);
  }
  
  getNotifications() {
    return this.httpClient.get(`${urls.baseUrl}${urls.getNotifications}`);
  }
  
  getProfile() {
    let token = this.userService.getToken();
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
    console.log(urls.baseUrl, urls.getProfile, "urls to user");
    return this.httpClient.get(`${urls.baseUrl}${urls.getProfile}`, {headers: headers});
  }

  modifyProfile(profile) {
    let token = this.userService.getToken();
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
  	return this.httpClient.patch(`${urls.baseUrl}${urls.updateUser}` + this.userService.user['_id'], profile, {headers: headers});
  }

  setPushNotificationStatus(status) {
  	const formFields = JSON.stringify(status);
  	return this.httpClient.post(`${urls.baseUrl}${urls.setPushNotificationStatus}`, formFields, httpOptions);
  }

  setEmailNotificationStatus(status) {
  	const formFields = JSON.stringify(status);
  	return this.httpClient.post(`${urls.baseUrl}${urls.setEmailNotificationStatus}`, formFields, httpOptions);
  }

  resendVerificationEmail(email) {
    const formFields = JSON.stringify(email);
    return this.httpClient.post(`${urls.baseUrl}${urls.resendVerificationEmail}`, formFields, httpOptions);
  }

  googleAuth(payload: any) {
    return this.httpClient.post(`${urls.baseUrl}${urls.googleAuth}`, payload);    
  }

  getPurchaseCoin(perPage=5, page=1, status?: String){
    let token = this.userService.getToken();
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
    if(status) {
      return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoins}?perPage=${perPage}&page=${page}&status=${status}`, {headers: headers})
      // .pipe(catchError( this.handleError));
    } else {
      return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoins}?perPage=${perPage}&page=${page}`, {headers: headers})
      // .pipe(catchError( this.handleError));
    }
  }
  
  getBlockchainTransactions(perPage=5, page=1, status?: String){
    let token = this.userService.getToken();
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
    return this.httpClient.get(`${urls.baseUrl}${urls.getBlockchainTransactions}?limit=${perPage}&offset=${page-1}`, {headers: headers});    
  }

  sendCoin(payload:any){
    let token = this.userService.getToken();
    let headers = new HttpHeaders({"Authorization": token['tokenType']+ ' ' +token['accessToken']});
    return this.httpClient.post(`${urls.baseUrl}${urls.sendCoins}`, payload, {headers: headers});
  }

  correctCoins (input){
    if (!input) {
                return '0.0';
            }
    
            input = input.toString();
    
            while (input.length < 9) {
              input = '0'.concat(input);
            }
    
            var intPart = input.slice(0, -8);
            var decimal = input.slice(-8);
    
            var clearView = false;
    
            while (!clearView) {
                if (decimal[decimal.length - 1] == '0') {
                    decimal = decimal.slice(0, decimal.length - 1);
                } else {
                    clearView = true;
                }
            }
            if(decimal && decimal.length > 0){
              decimal = '.' + decimal;
            }
            return intPart + '' + decimal;
    }

    fullTimestamp(time)
    {
     let d = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0));
     let t = parseInt((d.getTime() / 1000) + '');
   
     d = new Date((time + t) * 1000);
     let month = d.getMonth() + 1;
   
     if (month < 10) {
       month = parseInt("0" + month);
     }
   
     let day = d.getDate();
   
     if (day < 10) {
       day = parseInt("0" + day);
     }
   
     let h = d.getHours();
     let m = d.getMinutes();
     let s = d.getSeconds();
   
     if (h < 10) {
       h = parseInt("0" + h);
     }
   
     if (m < 10) {
       m = parseInt("0" + m);
     }
   
     if (s < 10) {
       s = parseInt("0" + s);
     }
   
     return d.getFullYear() + "/" + month + "/" + day + " " + h + ":" + m + ":" + s;
   }
   
  // private handleError =  (error: HttpErrorResponse | any) => {
  //   console.log("error",error);
    
  //   switch (error.error.code) {
  //     case 400:
  //     console.log(400);
  //     break;
  //     case 401:
  //       this.userService.setToken(null);
  //       this.navctl.push(LoginPage);
        
  //       console.log(401);
      
  //     break;
  //     case 500:
  //     console.log(500);
  //     break;
  //     case 503:
  //     break;
  //     case 0:
  //     console.log(0);
  //     break;
  //   }            
    
  //   let errMsg: any;
  //   // if (error instanceof Response) {
  //   //   const body = error || '';
  //   //   const err = body || JSON.stringify(body);
  //   //   console.log(" console.log", errMsg);
  //   //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   //   console.log("...errMsg",errMsg);
  //   // } else {
  //   //   errMsg = JSON.parse(error._body) ? JSON.parse(error._body) : {};
  //   //   console.log("...errMsg",errMsg.error_description);
  //   // }
    
  //   return throwError(error);
  // }
}