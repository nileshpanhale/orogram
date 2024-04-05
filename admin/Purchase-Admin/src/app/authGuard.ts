import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor( private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn()) {
      return true;
    } else {
      console.log('Problem')
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
  }

  isLoggedIn (){
      let token = localStorage.getItem('access_token') !== null && localStorage.getItem('access_token').length > 15;
      let role = localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'subAdmin';
      // let address = localStorage.getItem('address') !== null && localStorage.getItem('address').length > 10;
      return token && role;
  }
}