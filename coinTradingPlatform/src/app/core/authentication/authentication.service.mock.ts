import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {

  credentials: Credentials | null = {
    user: {},
      token: {}
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      user: context,
      token: {}
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

}
