import { Component, OnInit} from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare var jsPDF: any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
declare var jquery:any;
declare var $ :any;
// import { $ } from 'protractor';
import { Socket } from 'ng-socket-io';
import { SharedService } from 'Services/shared.services';

@Component({
  selector: 'app-transaction',
  templateUrl: './wallet-transaction.component.html',
  styleUrls: ['./wallet-transaction.component.css']
})
export class WalletTransactionComponent implements OnInit {

  public accountAddresses:any;
  public totalCoin:any;
  public holdedCoin:any;
  public holdedCoinS:any;
  //public remainingCoinsS:any;
  public remainingCoins:any;
  public coinCount:any;
  public isLoading=true;
  public container:any;
  public perPage:number=100;
  public walletAddress:any='';
  public description:any;
  public count:number=0;

  pageNumbers = [1];
  currentPage=1;
  status: string;
  loading = true;

  constructor( public userService : UserService, public router:Router, private socket: Socket, public sharedService : SharedService ) { 
   
  }

 

  ngOnInit() {
    this.getWalletTransaction();    
  }

  // searchCall(){
  //   if(this.description.length > 2){
  //     this.filterPayload['receiverId'] = this.description;
  //     this.currentPage = 1;
  //     this.getWalletTransaction();
  //   }else{
  //     if(this.description.length == 2){
  //       this.filterPayload['receiverId'] = '';
  //       this.currentPage = 1;
  //       this.getWalletTransaction();
  //     }
  //   }
  // }

  getWalletTransaction(){

    this.loading = true;
      this.userService.getWalletTransactions(this.perPage, this.currentPage, this.status).subscribe(
        (data:any) => {
          console.log("UserSendCoin", data);
          this.container = data.transfers;
          console.log("data : ", this.container);
          if((!this.count) && (data['count'])){
            this.count = data['count'];
          }
          this.generatePageNumbers( this.count  );
          // this.store = data;
        },
        error => {
          // console.log("error",error);
        }
      )

  }


  intToDecimal (input:any){
    if (!input || input < 0 ) {
                return '0.0';
            }
    
            input = input.toString();

            input = input.split('.')[0];

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
            if(decimal && decimal.length > 0){
              decimal = '.' + decimal;
            }
            return intPart + '' + decimal;
    }

    intoDateFormat (input:any) {
      // console.log("111", input)
      let ts = new Date(input)
      // return ts.toLocaleString()
      return ts.toUTCString()


    }

    pageChange(value?: any) {
      // this.setActive();
      
      if(value) {
        console.log("CLIK on page number",value);
        
        this.currentPage = value? value: this.currentPage++;
      } else if( (this.currentPage + 1) <= this.pageNumbers.length){
        console.log("CLICK on next");
        
        this.currentPage++;
      }
      this.loading = true;
      this.userService.getWalletTransactions(this.perPage, this.currentPage, this.status).subscribe( res => {
        this.generatePageNumbers( this.count  );
        this.container = res['transfers'];
      });
    }

    generatePageNumbers(value:any) {
      let limit = Math.ceil( (value/this.perPage) );
      this.pageNumbers.splice(0, this.pageNumbers.length);
      for(let i=1; i<=limit; i++) {
      this.pageNumbers.push(i);
      }
    }
  
     perPageChange() {
       this.loading = true;
      this.userService.getWalletTransactions(this.perPage,1, this.status).subscribe( res => {
        this.generatePageNumbers( this.count  );
        this.currentPage = 1;
        this.container = res['transfers'];
        // this.setActive();
      });
    }
    


}