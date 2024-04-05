import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { UserResponseService } from '../../Services/userResponse.service';
// import { ScrollbarsComponent } from '../scrollbars/scrollbars.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

  public tradeOrder: number;
  public buyOrder: number;
  public sellOrder: number;

  public totalUser: number;
  public activeUser: number;
  public deactiveUser: number;

  public availableToken: number;
  public sentToken: number;
  public receivedToken: number;

  public holdedToken: number;

  constructor(private userService: UserService, public router: Router, private userResponseService: UserResponseService) { }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.userService.companyStats().subscribe(
      (data: any) => {
        console.log('Received Data : ', data);

        // this.tradeOrder = data.trade.trade;
        // this.buyOrder = data.trade.buy;
        // this.sellOrder = data.trade.sell;

        // this.totalUser = data.users.total;
        // this.activeUser = data.users.active;
        // this.deactiveUser = data.users.deactive;

        this.availableToken = data.balance;
        // this.availableToken = parseFloat(this.intToDecimal(data.balance))/100;    // balance * 1/100
        this.sentToken = data.balance.sent;
        this.receivedToken = data.balance.received;
      },
      error => {
        console.log(error);
      }
    )

    this.userService.adminStats().subscribe(
      (data: any) => {
        // console.log(data);
        this.tradeOrder = data.trades;
        this.buyOrder = data.buys;
        this.sellOrder = data.sells;
      },
      error => {

      }
    )

    this.userService.holdStats().subscribe(
      (data: any) => {

        console.log("Admin holded balance : ", data);
        // console.log("holdstats : ",data.totalTradeHolded[0].totalholdedTrade, data);
        this.holdedToken = data.totalAdminHolded;
        // this.holdedToken = parseFloat(this.intToDecimal(data.totalAdminHolded)) / 100         // balance * 1/100

      },
      error => {

      }
    )

    this.userService.userStats().subscribe(
      (data: any) => {
        // console.log(data);
        this.totalUser = data.users;
        this.activeUser = data.activerUsers;
        this.deactiveUser = data.deactiverUsers;
      },
      error => {

      }
    )
  }

  tradeSummary() {
    this.router.navigate(['/admin/transaction']);
  }

  userSummary() {
    this.router.navigate(['/admin/user_details']);
  }

  balanceSummary() {
    this.router.navigate(['/admin/send_token']);
  }

  intToDecimal(input: any) {
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
    if (decimal && decimal.length > 0) {
      decimal = '.' + decimal;
    }
    return intPart + '' + decimal;
  }

  getBalance(input: any) {

    if (!input) {
      return '0.0';
    }
    else {
      var userBalance = (input * Math.pow(10, -8)).toFixed(8);
      return userBalance;
    }
  }

  isCorrectValue(currency: any, throwError: any, decimalsVal: any) {
    var parts = String(currency).trim().split('.');
    var amount = parts[0];
    var fraction = '';

    if (!throwError) throwError = false;

    function error(message: any) {
      var errorMsg = message;

      if (throwError) {
        throw errorMsg;
      } else {
        console.error(message);
        return false;
      }
    }

    if (amount == '') {
      return error('Crypto amount can not be blank');
    }

    if (parts.length == 1) {
      // No fractional part
      for (let k = 0; k < decimalsVal; k++) {
        fraction = fraction + '0';
      }
    } else if (parts.length == 2) {
      if (parts[1].length > 8) {
        return error('Crypto amount must not have more than 8 decimal places');
      } else if (parts[1].length <= 8) {
        // Less than eight decimal places
        fraction = parts[1];
      } else {
        // Trim extraneous decimal places
        fraction = parts[1].substring(0, 8);
      }
    } else {
      return error('Crypto amount must have only one decimal point');
    }

    // Pad to eight decimal places
    for (var i = fraction.length; i < 8; i++) {
      fraction += '0';
    }

    // Check for zero amount
    if (amount == '0' && fraction == '00000000') {
      return error('Crypto amount can not be zero');
    }

    // Combine whole with fractional part
    var result = amount + fraction;

    // In case there's a comma or something else in there.
    // At this point there should only be numbers.
    if (!/^\d+$/.test(result)) {
      return error('Crypto amount contains non-numeric characters');
    }

    // Remove leading zeroes
    result = result.replace(/^0+/, '');

    return parseInt(result);
  }

}
