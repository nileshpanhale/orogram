import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../authentication/authentication.service';
import { I18nService } from '../../i18n.service';
import { SharedService } from 'services/shared.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuHidden = true;
  public logout_icon: any;
  public firstName: string;
  public notifications: any = {
    total: 0,
    openContractSell: 0,
    openContractBuy: 0,
    openTradeSell: 0,
    openTradeBuy: 0,
    privateContractSell: 0,
    privateContractBuy: 0,
  };

  public historyNotifications: any = {
    total: 0,
    contractHistory: 0,
    privateContractHistory: 0,
    tradeHistory: 0,
  };

  constructor(private router: Router,
    public authenticationService: AuthenticationService,
    public sharedService: SharedService,
    private i18nService: I18nService) {
    this.sharedService.notification.subscribe((res: any) => {
      if(res.historyUserId){
        this.manageHistoryNotifications(res);
      }else{
        this.manageNotifications(res);
      }
    })

    
    // if (localStorage.getItem('notifications')) {
    //   this.notifications = JSON.parse(localStorage.getItem('notifications'));
    // }

    if (localStorage.getItem('historyNotifications')) {
      this.historyNotifications = JSON.parse(localStorage.getItem('historyNotifications'));
    }
  }

  ngOnInit() { // Get the modal
    if (this.authenticationService.isAuthenticated()) {
      this.firstName = localStorage.getItem('firstName');
    }
    var modal = document.getElementById('id01');
    this.logout_icon = this.authenticationService.isAuthenticated()

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event:any) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }


  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout()
      .subscribe(() => {
        this.authenticationService.setCredentials();
        this.router.navigate(['/login'], { replaceUrl: true })
      });
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return 'demo';
  }

  manageNotifications(data: any) {
    let user: any = JSON.parse(localStorage.getItem('credentials')).user;
    if (data.type != 'PRIVATE_CONTRACT') {
      this.notifications['total'] += data.value;
    }
    else {
      if ((data.type == 'PRIVATE_CONTRACT') && (data.privateUserId == user.email)) {
        this.notifications['total'] += data.value;
      }
    }

    if (data.type == 'CREATE_CONTRACT') {
      if (data.tradeType == 'BUY') {
        this.notifications['openContractSell'] += data.value;

      }
      if (data.tradeType == 'SELL') {
        this.notifications['openContractBuy'] += data.value;
      }
    }

    if (data.type == 'TRADE_ORDER') {
      if (data.tradeType == 'BUY') {
        this.notifications['openTradeSell'] += data.value;
      }
      if (data.tradeType == 'SELL') {
        this.notifications['openTradeBuy'] += data.value;

      }
    }

    if ((data.type == 'PRIVATE_CONTRACT') && (data.privateUserId == user.email)) {
      if (data.tradeType == 'BUY') {
        this.notifications['privateContractSell'] += data.value;

      }
      if (data.tradeType == 'SELL') {
        this.notifications['privateContractBuy'] += data.value;

      }
    }
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  manageHistoryNotifications(data:any){
    let user: any = JSON.parse(localStorage.getItem('credentials')).user;
    if(user._id == data.historyUserId){
      this.historyNotifications['total'] += data.value;

      if (data.type == 'CONTRACT_HISTORY') {
        this.historyNotifications['contractHistory'] += data.value;
      }
  
      if (data.type == 'PRIVATE_CONTRACT_HISTORY') {
        this.historyNotifications['privateContractHistory'] += data.value;
      }

      if (data.type == 'TRADE_ORDER_HISTORY') {
        this.historyNotifications['tradeHistory'] += data.value;
      }

      localStorage.setItem('historyNotifications', JSON.stringify(this.historyNotifications));
    }
  }

}
