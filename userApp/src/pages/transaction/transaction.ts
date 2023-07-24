import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { DataService } from '../../services/data.service';
// to remove
import { transactions } from '../../mockData/transactions';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-transaction',
  templateUrl: 'transaction.html'
})

export class Transaction {
	private transactions: any = [];
 	private error: string = '';

	public perPage:number=5;
	currentPage=1;
	pageNumbers = [1];
	status: string;
  constructor(public navCtrl: NavController, private dataService: DataService, public menuCtrl: MenuController, public userService: UserService) {
  	this.menuCtrl.enable(true);
  	this.getTransactions();
  }

  getTransactions() {
	  this.dataService.getBlockchainTransactions(this.perPage, this.currentPage, this.status).subscribe( (res: any) => {
		  this.transactions = res['transfers'];
		  this.generatePageNumbers(res['count']);
	  });
  }

  perPageChange(value:any) {
    this.dataService.getBlockchainTransactions(this.perPage,1, this.status).subscribe( res => {
      this.generatePageNumbers( res['count']  );
      this.currentPage = 1;
      this.transactions = res['transfers'];
    });
  }

  pageChange(value?: any) {
    if(value) {
      console.log("CLIK on page number");
      
      this.currentPage = value? value: this.currentPage++;
    } else if( (this.currentPage + 1) <= this.pageNumbers.length){
      console.log("CLICK on next");
      
      this.currentPage++;
    }
    this.dataService.getBlockchainTransactions(this.perPage, this.currentPage, this.status).subscribe( res => {
      this.generatePageNumbers( res['count']  );
      this.transactions = res['transfers'];
    });
  }
  // statusChange() {
  //   this.dataService.getBlockchainTransactions(this.perPage,1, this.status).subscribe( res => {
  //     this.generatePageNumbers( res['count']  );
  //     this.currentPage = 1;
  //     this.transactions = res['transfers'];
  //   });
  // }

  generatePageNumbers(value:any) {
    let limit = Math.ceil( (value/this.perPage) );
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for(let i=1; i<=limit; i++) {
      this.pageNumbers.push(i);
    }
  }
}
