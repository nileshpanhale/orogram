import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { catchError, map } from 'rxjs/operators';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// import { throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import urls from '../configs/urls';

@Injectable()
export class UserService {

    options;
    loginoptions;
    constructor(private http: Http, private httpClient: HttpClient, private router: Router) { }


    setHeaders() {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('tokenType');
        const httpOptionsAuth = {
            headersAuth: new Headers({
                'Access-Control-Allow-Origin': '*',
                // 'Content-Type': 'application/json',
                'Authorization': "Bearer" + " " + token
            })
        }
        const httpOptions = {
            headers: new Headers({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            })
        }
        this.options = new RequestOptions({ headers: httpOptionsAuth.headersAuth });
        this.loginoptions = new RequestOptions({ headers: httpOptions.headers });
    }


    setHeader(): Object {
        // console.log(localStorage.getItem('accessToken'), "inside set header if");
        if (localStorage.getItem('access_token')) {

            let headers = new HttpHeaders({
                // 'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            });
            return { headers };
        } else {
            // console.log("inside set header else");

            let headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
            return { headers };

        }

    }


    login(data: object) {
        return this.httpClient.post(`${urls.baseUrl}${urls.login}`, data, this.loginoptions);
    }

    accountInfo(data: object) {
        return this.httpClient.post(`${urls.baseUrl}${urls.accountInfo}`, data, this.setHeader())
            .pipe(catchError(this.handleError));;
    }

    getAccountInfo() {
        return this.httpClient.get(`${urls.baseUrl}${urls.getAccountInfo}`, this.setHeader())
            .pipe(catchError(this.handleError));
    }

    getHashDetails(hash?: String) {
        return this.httpClient.get(`${urls.baseUrl}${urls.gettxhash}/${hash}`, this.setHeader()) // will be changed
    }

    getTradeHashDetails(hash?: String) {
        return this.httpClient.get(`${urls.baseUrl}${urls.gettxhash1}/${hash}`, this.setHeader()) // will be changed
    }

    getAdminHashDetails(hash?: String) {
        return this.httpClient.get(`${urls.baseUrl}${urls.gettxhash2}/${hash}`, this.setHeader()) // will be changed
    }


    companyStats() {
        return this.httpClient.get(`${urls.baseUrl}${urls.companyStats}`, this.setHeader())
            .pipe(catchError(this.handleError));
    }

    adminStats() {
        return this.httpClient.get(`${urls.baseUrl}${urls.adminStats}`, this.setHeader())
            .pipe(catchError(this.handleError));
    }

    holdStats() {
        return this.httpClient.get(`${urls.baseUrl}${urls.holdStats}`, this.setHeader())
            .pipe(catchError(this.handleError));
    }


    userStats() {
        return this.httpClient.get(`${urls.baseUrl}${urls.userStats}`, this.setHeader())
            .pipe(catchError(this.handleError));
    }

    forgotPassword(payload: any) {
        const formFields = JSON.stringify(payload);
        return (this.httpClient.post(`${urls.baseUrl}${urls.forgotpasswd}`, formFields, this.setHeader()))
    }

    passwordChange(payload: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.forget}`, payload, this.setHeader()) // will be changed
    }

    resetPassword(pwd: any) {
        const headers = new Headers({
            // 'Access-Control-Allow-Origin': '*'
        }); // ... Set content type to JSON 
        const options = new RequestOptions({ headers: headers }); // Create a request option
        return this.http.put(`${urls.baseUrl}${urls.resetpass}`, pwd, options) // will be changed
            .map((res: Response) => res.json);
    }

    getCurrencyRate(){
      return this.httpClient.get(`${urls.baseUrl}${urls.currencyRate}`,this.setHeader()) // will be changed
    }  
    
    getGoldPrice(){
      return this.httpClient.get(`${urls.baseUrl}${urls.goldprice}`,this.setHeader()) // will be changed
    }

    getCount() {
        const headers = new Headers({
            // 'Access-Control-Allow-origin':'*',
            'Authorization': localStorage.getItem('accessToken')
        });
        const options = new RequestOptions({ headers: headers });
        return this.http.get(`${urls.baseUrl}${urls.tradetx}`, options) // will be changed
            .map((res: Response) => res.json);
    }

    getWalletTransactions(perPage=20, page=1, status?: String) {
        if(status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.getBlockchainTransactions}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader()) // will be changed
        }
        else{
            return this.httpClient.get(`${urls.baseUrl}${urls.getBlockchainTransactions}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
        }
    }

    getAdminTx2(id:any, perPage = 20, page = 1, status?: String) {
        if (status) {
          return this.httpClient.get(`${urls.baseUrl}${urls.getBlockchainTransactions2}/${id}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader()) // will be changed
        }
        else {
          return this.httpClient.get(`${urls.baseUrl}${urls.getBlockchainTransactions2}/${id}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
        }
      }

    getPurchaseTransaction(perPage, page = 1, filterPayload, wallet?: String) {
        if (wallet) {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchasetx}?perPage=${perPage}&page=${page}&wallet=${wallet}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be change
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchasetx}?perPage=${perPage}&page=${page}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }

    getPurchaseTransactionAdmin(perPage, page = 1, filterPayload, wallet?: String) {
        if (wallet) {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?perPage=${perPage}&page=${page}&wallet=${wallet}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be change
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoinsAdmin}?perPage=${perPage}&page=${page}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }

    getuserDetails(perPage, page = 1, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.userDetails}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.userDetails}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }

    getAccountDetails1(id:any) {
        return this.httpClient.get(`${urls.baseUrl}${urls.getAccountDetails}/${id}`,this.setHeader())
          .pipe(catchError(this.handleError));
      }

    getuserVoterDetails() {

        return this.httpClient.get(`${urls.baseUrl}${urls.userDetails}`, this.setHeader()) // will be changed
            .pipe(catchError(this.handleError));
    }

    confirmCoin(data: any) {

        console.log("Data before hitting ASCH Blockchain : ", data);
        console.log("--------------BLOCKCHAIN-------------------------")
        return this.httpClient.post(`${urls.baseUrl}${urls.confirmCoin}`, data, this.setHeader()) // will be changed
            .pipe(catchError(this.handleError));
    }

    changeStatusTransaction(txn_id, payload: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.changeStatus}` + txn_id, payload, this.setHeader()) // will be changed
            .pipe(catchError(this.handleError));
    }
    changeStatusTransactionUser(txn_id, payload: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.changeStatusUser}` + txn_id, payload, this.setHeader()) // will be changed
            .pipe(catchError(this.handleError));
    }

    changeUserActivity(_id: any, payload: any) {
        return this.httpClient.patch(`${urls.baseUrl}${urls.changeActivity}` + _id, payload, this.setHeader()) // will be changed
            .pipe(catchError(this.handleError));
    }

    createUser(data: any) {
        return this.httpClient.post(`${urls.baseUrl}${urls.createUser}`, data, this.setHeader()) // will be changed
    }

    getTradeTx(perPage, page = 1, filterPayload:any, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.tradetx}?perPage=${perPage}&page=${page}&status=${status}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.tradetx}?perPage=${perPage}&page=${page}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }

    getContractTx(perPage, page = 1, filterPayload:any, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.contracttx}?perPage=${perPage}&page=${page}&status=${status}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.contracttx}?perPage=${perPage}&page=${page}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }

    getLandContractTx(perPage, page = 1, filterPayload:any, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.landContracttx}?perPage=${perPage}&page=${page}&status=${status}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.landContracttx}?perPage=${perPage}&page=${page}${this.getQueryParams(filterPayload)}`, this.setHeader()) // will be changed
                .pipe(catchError(this.handleError));
        }
    }



    getAdminTx(perPage, page = 1, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.admintxn}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader()) // will be changed
        }
        else {
            return this.httpClient.get(`${urls.baseUrl}${urls.admintxn}?perPage=${perPage}&page=${page}`, this.setHeader()) // will be changed
        }
    }

    sendCoin(payload: any) {
        return this.httpClient.post(`${urls.baseUrl}${urls.sendcoin}`, payload, this.setHeader()) //will be changed
    }



    userprofileUpdate(data: any) {
        const formFields = JSON.stringify(data);
        const headers = new Headers({
            // 'Access-Control-Allow-Origin':'*'
        });
        const options = new RequestOptions({ headers: headers });

        // return this.httpClient.disableApiPrefix().patch(`${urls.baseUrl}${urls.userprofileUpdate}${data}`, httpOptionsForAuthorisation);
    }

    updatePassword(passwd: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.updatepassword}`, passwd, this.setHeader()) //will be changed
    }

    imageupload(data: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.imageUpload2}`, data, this.setHeader());
    }

    uploadProfilePic(data: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.profilepic}`, data, this.setHeader());
    }

    changeEmail(data: any) {
        return this.httpClient.patch(`${urls.baseUrl}${urls.changeUserStatus}/` + localStorage.getItem('id'), data, this.setHeader())
    }
    logout(body:any) {
        // Customize credentials invalidation here
        // let body = {
        //   token: localStorage.getItem('access_token')
        // }    
        return this.httpClient.put(`${urls.baseUrl}${urls.logout}`, body, httpOptions );
        // this.setCredentials();
        // return of(true);
    }


    getUserProfile() {
        return this.httpClient.get(`${urls.baseUrl}${urls.getUserProfile}`, this.setHeader()) // will be changed
    }

    getAccountDetails() {
        return this.httpClient.get(`${urls.baseUrl}${urls.accountDetails}`, this.setHeader()) // will be changed
    }

    getDelegateList() {
        return this.httpClient.get(`${urls.baseUrl}${urls.delegateList}`, this.setHeader())
    }

    getAdminUpvoted() {
        return this.httpClient.get(`${urls.baseUrl}${urls.upvotedUsers}`, this.setHeader())
    }

    checkForUser(data: any) {
        return this.httpClient.put(`${urls.baseUrl}${urls.checkForUser}`, data, this.setHeader())
    }

    sendForUpvote(payload: any) {
        return this.httpClient.post(`${urls.baseUrl}${urls.sendForUpvote}`, payload, this.setHeader())
    }

    sendForDownvote(payload: any) {
        return this.httpClient.post(`${urls.baseUrl}${urls.sendForDownvote}`, payload, this.setHeader())
    }

    creteDelegate(payload) {
        return this.httpClient.post(`${urls.baseUrl}${urls.delegateRegister}`, payload, this.setHeader())
    }

    changeTradeStatus(txnId, payload) {
        return this.httpClient.put(`${urls.baseUrl}${urls.changeTradeStatus}/` + txnId, payload, this.setHeader())
    }


    changeContractStatus(txnId, payload) {
        return this.httpClient.put(`${urls.baseUrl}${urls.changeContractStatus}/` + txnId, payload, this.setHeader())
    }

    //purchase integration changes----------------

    purchaseCoin(payload: any) {
        return this.httpClient.post(`${urls.baseUrl}${urls.purchaseCoinsAdmin}`, payload, this.setHeader())
            .pipe(catchError(this.handleError));
    }


    getPurchaseCoin(perPage, page = 1, status?: String) {
        if (status) {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoins}?perPage=${perPage}&page=${page}&status=${status}`, this.setHeader())
                .pipe(catchError(this.handleError));
        } else {
            return this.httpClient.get(`${urls.baseUrl}${urls.purchaseCoins}?perPage=${perPage}&page=${page}`, this.setHeader())
                .pipe(catchError(this.handleError));
        }
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
                localStorage.removeItem('access_token');
                localStorage.removeItem('tokenType');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('expiresIn');
                localStorage.removeItem('userId');
                localStorage.removeItem('isActive');
                localStorage.removeItem('email');
                localStorage.removeItem('role');
                localStorage.removeItem('emailVerified');
                localStorage.removeItem('lastUpdatedPassword');
                localStorage.removeItem('id');
                localStorage.removeItem('picture');
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

        return (error);
    }
}