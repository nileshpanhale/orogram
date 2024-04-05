import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import urls from '../../../configs/urls';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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

  public _credentials: Credentials | null;

  constructor(
    private httpClient : HttpClient
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
    // Replace by proper authentication call
     let data = {
       user: {},
       token: {}
     };
     console.log(context);
     const formFields = (context);
     console.log(formFields);

     return this.httpClient.disableApiPrefix().post(`${urls.baseUrl}${urls.login}`, formFields, httpOptions);
     
    //  return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    // Customize credentials invalidation here
    let body = {
      token: localStorage.getItem('accessToken')
    }    
    return this.httpClient.disableApiPrefix().put(`${urls.baseUrl}${urls.logout}`, body, httpOptions);
    // this.setCredentials();
    // return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    // console.log('this.credentials', this._credentials, this.credentials);
    return this.credentials?true:false;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  data(): Credentials | null{
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  public setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      // const storage = remember ? localStorage : sessionStorage;
      console.log('In authentication');
      localStorage.setItem(credentialsKey, JSON.stringify(credentials));
      localStorage.setItem('accessToken',credentials.token.accessToken);
      localStorage.setItem('id',credentials.user._id);
      localStorage.setItem('firstName',credentials.user.firstName);
      localStorage.setItem('lastName',credentials.user.lastName);
      localStorage.setItem('email', credentials.user.email);
      localStorage.setItem('mobile', credentials.user.mobile);
    } else {
      localStorage.removeItem(credentialsKey);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('id');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('email');
      localStorage.removeItem('mobile');
    }
  }

}
