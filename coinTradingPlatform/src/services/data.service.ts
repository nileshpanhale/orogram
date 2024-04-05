import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '@app/core';
import { UserService } from './user.service';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import urls from '../configs/urls';
import vars from '../configs/vars';

import { Observable } from 'rxjs';

import { Router } from '@angular/router';



@Injectable()
export class DataService {
  constructor(private httpClient: HttpClient, private router: Router, public authenticationService: AuthenticationService) {
  }


  setHeader(): Object {
    // console.log(localStorage.getItem('accessToken'), "inside set header if");
    if (localStorage.getItem('accessToken')) {

      let headers = new HttpHeaders({
        // 'Content-Type': 'application/json',

        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        // 'Access-Control-Allow-Origin':'*'
      });

      // headers.append('Access-Control-Allow-Origin', '*');
      // headers.append('Access-Control-Allow-Credentials', 'true');

      //   headers.append('Content-Type', 'application/json');
      // headers.append('Accept', 'application/json');
      // headers.append('GET', 'POST');

      return { headers };
    } else {
      // console.log("inside set header else");

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin':'*'
      });

      // headers.append('Access-Control-Allow-Origin', '*');
      // headers.append('Access-Control-Allow-Credentials', 'true');

      // headers.append('GET', 'POST');
      return { headers };

    }

  }

  // getHeaders(){
  //   if( localStorage.getItem('token') ){
  //     let token = JSON.parse(localStorage.getItem('token'));
  //     let headers = new HttpHeaders({
  //       // 'Content-Type': 'application/json',
  //       'Authorization': token['tokenType'] + ' ' + token['accessToken']
  //     });
  //     return {headers};
  //   } else {
  //     let headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     });
  //     return {headers};
  //   }
  //  }


  getCurrencyRate() {

    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.currencyRate}`, this.setHeader()) // will be changed


  }


  getGoldPrice() {

    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.goldprice}`, this.setHeader()) // will be changed


  }


  getBTCPrice() {

    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.btcapi}`, this.setHeader()) // will be changed


  }

  //gethash Details ------------------------------------------------------

  getHashDetails(hash?: String) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.gettxhash}/${hash}`, this.setHeader()) // will be changed
  }

  getTradeHashDetails(hash?: String) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.gettxhash1}/${hash}`, this.setHeader()) // will be changed
  }

  getAdminHashDetails(hash?: String) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.gettxhash2}/${hash}`, this.setHeader()) // will be changed
  }

  //user send coins API creation ----------------------------
  getAdminTx(perPage = 20, page = 1, status?: String) {
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getBlockchainTransactions}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader()) // will be changed
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getBlockchainTransactions}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
    }
  }

  //sending coins to user -----------------------
  sendCoin(payload: any) {
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.sendCoins}`, payload, this.setHeader()) //will be changed

    //return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.register}`, formFields, this.setHeader());
  }

  enquiry(result: any) {
    const formFields = JSON.stringify(result);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.enquiry}`, formFields, this.setHeader());
  }

  register(fields: any) {
    const formFields = JSON.stringify(fields);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.register}`, formFields, this.setHeader());
  }

  login(fields: any) {
    console.log("In login");
    const formFields = JSON.stringify(fields);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.login}`, formFields, this.setHeader());
  }

  signup(fields: any) {
    const formFields = JSON.stringify(fields);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.register}`, formFields, this.setHeader());
  }

  verifyOtp(otp: any) {
    const formFields = JSON.stringify(otp);
    console.log('here', otp);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.verifyOtp}`, formFields, this.setHeader());
  }

  userdelete(userid: any) {
    return this.httpClient.disableApiPrefix().delete(`${urls.baseUrl}${urls.userdelete}${userid}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  userprofileUpdate(data: any) {
    return this.httpClient.disableApiPrefix().patch(`${urls.baseUrl}${urls.userprofileUpdate}`, data, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  imageupload(uploadData: any) {
    const formFields = JSON.stringify(uploadData);
    console.log('uploadData input', uploadData);
    console.log(this.setHeader());

    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.imageupload}`, uploadData, this.setHeader());
  }

  // upload user documents
  docUpload(uploadData: any) {
    const formFields = JSON.stringify(uploadData);
    console.log('uploadData input', uploadData);
    console.log(this.setHeader());

    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.docUpload}`, uploadData, this.setHeader());
  }

  imageuploadmulti(uploadData: any) {
    const formFields = JSON.stringify(uploadData);
    console.log('uploadData input', uploadData, formFields);
    console.log(this.setHeader());

    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.imageuploadmulti}`, uploadData);
  }

  // imageupload(uploadData:any) {
  //   const formFields = JSON.stringify(uploadData);
  //   console.log('uploadData input', uploadData);
  //   return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.imageupload}`, uploadData, this.getHeaders());
  // }

  confirmWiretransfer(fields: any) {
    const formFields = JSON.stringify(fields);
    console.log('payment input', fields);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.confirmWiretransfer}`, formFields, this.setHeader());
  }

  getTx() {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTx}`, this.setHeader());
  }

  search() {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.search}`, this.setHeader());
  }

  getTrade(perPage = 5, page = 1, searchString?: String,) {
    //  console.log(this.setHeader(), "new headres");
    if (searchString) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeHistory}?&searchString=${searchString}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeHistory}?`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }
  
  getAllTradeContracts() {
    //  console.log(this.setHeader(), "new headres");
   
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeContractAllHistory}?perPage=10&page=1`, this.setHeader())
        .pipe(catchError(this.handleError));
    
  }
  getTradeContracts(perPage = 5, page = 1, searchString?: String,) {
    //  console.log(this.setHeader(), "new headres");
    if (searchString) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeContractHistory}?&searchString=${searchString}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeContractHistory}?`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }
  changeStatusTransactionUser(txn_id: any, payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.changeStatusUser}` + txn_id, payload, this.setHeader()) // will be changed
      .pipe(catchError(this.handleError));
  }
  getTradeContractAllHistory(perPage = 5, page = 1, searchString?: String,) {
    //  console.log(this.setHeader(), "new headres");
    if (searchString) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeContractAllHistory}?perPage=${perPage}&page=${page}&searchString=${searchString}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getTradeContractAllHistory}?perPage=${perPage}&page=${page}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  getPurchaseTransaction(perPage = 5, page = 1, wallet?: String) {
    if (wallet) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchasetx}?perPage=${perPage}&page=${page}&wallet=${wallet}`, this.setHeader()) // will be change
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchasetx}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
        .pipe(catchError(this.handleError));
    }
  }

  getPurchaseTransactionAdmin(perPage = 5, page = 1, wallet?: String) {
    if (wallet) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?&wallet=${wallet}`, this.setHeader()) // will be change
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?`, this.setHeader()) // will be changed
        .pipe(catchError(this.handleError));
    }
  }

  userLandContracts(perPage = 5, page = 1, wallet?: String) {
    if (wallet) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.userLandContracts}?&wallet=${wallet}`, this.setHeader()) // will be change
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.userLandContracts}?`, this.setHeader()) // will be changed
        .pipe(catchError(this.handleError));
    }
  }

  changeStatusTransaction(txn_id: any, payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.changeStatus}` + txn_id, payload, this.setHeader()) // will be changed
      .pipe(catchError(this.handleError));
  }


  changeStatusTransactionAdminTran(txn_id: any, payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.changeStatusAdminTran}` + txn_id, payload, this.setHeader()) // will be changed
      .pipe(catchError(this.handleError));
  }



  acceptAdminReq(txn_id: any, payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.acceptAdminReq}` + txn_id, payload, this.setHeader()) // will be changed
      .pipe(catchError(this.handleError));
  }

  changeStatusTransactionContract(txn_id: any, payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.changeStatusContract}` + txn_id, payload, this.setHeader()) // will be changed
      .pipe(catchError(this.handleError));
  }

  getBuyTransaction(perPage = 5, page = 1, status?: String) {
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.buytxn}&status=${status}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.buytxn}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  getBuyContractTransaction(perPage = 5, page = 1, filterPayload: any, status?: String) {

    // payload = {country:'India',name:'Vishal'};
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.buycontracttxn}&status=${status}${this.getQueryParams(filterPayload)}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.buycontracttxn}${this.getQueryParams(filterPayload)}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  buyCoins(payload: any, txn_id: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.buyCoin}/${txn_id}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  buyCoinsContract(payload: any, txn_id: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.buyCoinContract}/${txn_id}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getSellTransaction(perPage = 5, page = 1, status?: String) {
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.selltxn}&status=${status}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.selltxn}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  getSellContractTransaction(perPage = 5, page = 1, filterPayload: any, status?: String) {
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.sellcontracttxn}&status=${status}${this.getQueryParams(filterPayload)}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
    else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.sellcontracttxn}${this.getQueryParams(filterPayload)}`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  sellCoins(payload: any, txn_id: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.sellCoin}/${txn_id}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  sellCoinsContract(payload: any, txn_id: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.sellCoinContract}/${txn_id}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  filterBuy(data: any) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.buytxn}&country=${data.country}&currency=${data.currency}&amount=${data.amount}&method=${data.transactionMethod}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  filterSell(data: any) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.selltxn}&country=${data.country}&currency=${data.currency}&amount=${data.amount}&method=${data.transactionMethod}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getAccountDetails() {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.accountDetails}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getAccountCoinDetail(address: any) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.accountCoinDetails}/${address}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  createOrder(payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.createOrder}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }


  createContractOrder(payload: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.createContractOrder}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  buylandFromMap(payload: any) {
    // const landData = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.buyLand}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getMapCoordinates(hash?: String) {
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getMap}`, this.setHeader())
  }

  createAccount(payload: any) {
    const formFields = JSON.stringify(payload);
    return (this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.createAccount}`, payload, this.setHeader()))
  }

  getUserProfile() {
    return (this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getProfile}`, this.setHeader()))
      .pipe(catchError(this.handleError));
  }

  forgotPassword(payload: any) {
    const formFields = JSON.stringify(payload);
    return (this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.forgotpasswd}`, formFields, this.setHeader()))
  }

  updatePassword(payload: any) {
    // const formFields = JSON.stringify(payload);
    return (this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.resetpasswd}`, payload, this.setHeader()))
      .pipe(catchError(this.handleError));
  }

  generatOtp(payload: any) {
    const formFields = JSON.stringify(payload);
    return (this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.generateOtp}`, formFields, this.setHeader()))
  }

  enableGoogleAuth() {
    return (this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.enableGoogle}`, {}, this.setHeader()))
      .pipe(catchError(this.handleError));
  }

  checkCode(payload: any) {
    const formFields = JSON.stringify(payload);
    return (this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.checkCode}`, formFields, this.setHeader()))
  }

  //purchase integration changes----------------

  purchaseCoin(payload: any) {          // buy coins from admin
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.purchaseCoins}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  purchaseCoinAdmin(payload: any) {             // sell coins to admin
    return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.purchaseCoinsAdmin}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getAccountInfo() {
    //this function returns admin account details   
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.getAccountInfo}`, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  getPurchaseCoin(perPage = 5, page = 1, status?: String) {          // get purchase coins
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoins}?&status=${status}`, this.setHeader())
        .pipe(catchError(this.handleError));
    } else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoins}?`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  getPurchaseCoinAdmin(perPage = 5, page = 1, status?: String) {       // get sell coins
    if (status) {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?&status=${status}`, this.setHeader())
        .pipe(catchError(this.handleError));
    } else {
      return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?`, this.setHeader())
        .pipe(catchError(this.handleError));
    }
  }

  //search user API ---------searchDescription
  searchUser(payload: any, query: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.searchUser}/${query}`, this.setHeader())
      //return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.searchUser}/${query}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }

  //search description API ---------searchDescription
  searchDescription(payload: any, query: any) {
    const formFields = JSON.stringify(payload);
    return this.httpClient.disableApiPrefix().get(`${urls.baseUrl}${urls.searchDescription}/${query}`, this.setHeader())
      //return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.searchUser}/${query}`, payload, this.setHeader())
      .pipe(catchError(this.handleError));
  }


  public getQueryParams(data: any) {

    let str = '';
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        //console.log('&'+key+'='+data[key]);

        //checking if key dont have value or null/empty ---------------
        if ((data[key] != '') && (data[key] != null)) {
          str += '&' + key + '=' + data[key]; console.log(str);
        }
      }
    }

    //alert(str);
    return str;



  }

  private handleError = (error: HttpErrorResponse | any) => {
    console.log("error", error);

    switch (error.error.code) {
      case 400:
        console.log(400);
        break;
      case 401:
        localStorage.removeItem(vars.credentialsKey);
        this.authenticationService.setCredentials();
        this.router.navigate(['/login']);

        console.log(401);

        break;
      case 500:
        console.log(500);
        break;
      case 503:
        break;
      case 0:
        console.log(0);
        break;
    }

    let errMsg: any;
    // if (error instanceof Response) {
    //   const body = error || '';
    //   const err = body || JSON.stringify(body);
    //   console.log(" console.log", errMsg);
    //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    //   console.log("...errMsg",errMsg);
    // } else {
    //   errMsg = JSON.parse(error._body) ? JSON.parse(error._body) : {};
    //   console.log("...errMsg",errMsg.error_description);
    // }

    return throwError(error);
  }

}