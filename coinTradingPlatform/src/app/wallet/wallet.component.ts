import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  public accountAddresses: any;
  public totalCoin: any;
  public holdedCoin: any;
  public holdedCoinS: any;
  public actualbalance: any;
  public remainingCoins: any;
  public coinCount: any;
  public isLoading = true;
  public container: any;
  public perPage: number = 100;
  public walletAddress: any = '';
  public description: any;
  public count: number = 0;
  public dates : any;



  pageNumbers = [1];
  currentPage = 1;
  status: string;
  loading = true;

  constructor(public dataService: DataService) { }

  key: string = 'walletaddress';
  reverse: boolean = false;
  sort(key: any) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  ngOnInit() {

    this.getAdminTx();
    this.dataService.getAccountDetails().subscribe(
      (data: any) => {
        this.isLoading = false;
        this.walletAddress = data.address;
        this.coinCount = data.bal.totalCoins;
        this.holdedCoinS = data.bal.holdedCoins;
        this.actualbalance = data.bal.calculatedCoins;
        
        this.totalCoin = this.coinCount;
        this.remainingCoins = this.actualbalance;
        // this.holdedCoin = this.holdedCoinS.toFixed(8);
        this.holdedCoin = this.holdedCoinS;
      },
      (error: any) => {
        // console.log(error);
      }
    );

  }

  getAdminTx() {
    this.loading = true;
    this.dataService.getAdminTx(this.perPage, this.currentPage, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(
      (data: any) => {
        console.log("User Transactions : ", data.data);
        this.container = data.data;
        this.container.sort((x : any, y : any) =>{
          return Date.parse(y.updatedAt) - Date.parse(x.updatedAt);
      });
     
        if ((!this.count) && (data['count'])) {
          this.count = data['count'];
        }
        this.generatePageNumbers(this.count);
      },
      error => {
        // console.log("error",error);
      }
    )
  }

  intToDecimal(input: any) {
    if (!input || input < 0) {
      return '0.0';
    }

    input = input.toString();

    input = input.split('.')[0];

    while (input.length < 9) {
      input = '0'.concat(input);
    }

    var intPart = input.slice(0, 8);
    var decimal = input.slice(8);

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

  intoDateFormat(input: any) {
    let ts = new Date(input)
    return ts.toUTCString()
  }

  pageChange(value?: any) {
    // this.setActive();

    if (value) {
      console.log("CLIK on page number", value);

      this.currentPage = value ? value : this.currentPage++;
    } else if ((this.currentPage + 1) <= this.pageNumbers.length) {
      console.log("CLICK on next");

      this.currentPage++;
    }
    this.loading = true;
    this.dataService.getAdminTx(this.perPage, this.currentPage, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.container = res['transfers'];
    });
  }

  generatePageNumbers(value: any) {
    let limit = Math.ceil((value / this.perPage));
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
    }
  }

  perPageChange() {
    this.loading = true;
    this.dataService.getAdminTx(this.perPage, 1, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.currentPage = 1;
      this.container = res['transfers'];

    });
  }

}
