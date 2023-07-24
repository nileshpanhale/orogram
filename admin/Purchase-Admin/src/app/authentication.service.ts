import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import urls from '../configs/urls';
// END_POINT = 'http://localhost:3000/v1'
// const httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

export interface Credentials {
  // Customize received credentials here
  user: any;
  token: any;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface SignupContext {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms?: boolean;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  permissions: Array<string>; 
  private _credentials: Credentials | null;

  constructor(
    private http:Http,   
  
    ) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }


  }



  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): any {
    console.log('this.credentials', this._credentials, this.credentials);

    //this.permissions=["admin","subadmin"]
    // Replace by proper authentication call
     let data = {
       user: {},
       token: {}
     };
     const formFields = JSON.stringify(context);
     const headers = new Headers({'Access-Control-Allow-Origin': '*'}); // ... Set content type to JSON 
     const options = new RequestOptions({ headers: headers }); // Create a request option
     return this.http.post(`${urls.baseUrl}${urls.login}`, formFields, options)
     .subscribe(
       (res: any)=>{
        console.log('response', res);
         if(res && res.token) {
           console.log('response', res);
           this.setCredentials(res)
           return res;
         } else {
           return data;
         }
       },
       (err: any) => {
         return data
         })

    // return this.http.post(this.END_POINT + "/auth/login", data, options)
    //     .map((res:Response) => res.json());
    //  return data;
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return 
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
 
    return !this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {

    // var servicevalue=this.userResponseService.getTransactions()
    //  console.log("servicevalue",servicevalue)
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }



  

}
