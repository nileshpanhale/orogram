import { Component, OnInit} from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
declare var jsPDF: any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
declare var jquery:any;
declare var $ :any;
// import { $ } from 'protractor';
import { Socket } from 'ng-socket-io';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  public selectedValue:any="";
  public selectedName:any="";
  public description:any;
  
  p: number = 1;
  public perPage:number=5;
  public container:any;
  public action:string="";

  public useridcurrent = "";

  pageNumbers = [1];
  currentPage=1;
  status: string;

  counter=0;
  public count:number=0;
  loading = true;

  constructor( public userService : DataService, public router:Router, private socket: Socket ) { 
    let value = 0;
    this.socket.on('newnotification', (data:any) =>{
      console.log("Data in transaction : " , data);
      // console.log("ADMIN SOCKET");
      // alert(data);
      ++value;
      // console.log('Value = ',value);
      
      localStorage.setItem('notify', JSON.stringify(value));
     });
  }

 

  ngOnInit() {
    localStorage.removeItem('notify');
    this.getPurchaseTransaction();
    this.useridcurrent = localStorage.getItem('id');
    console.log("user id to check : ", this.useridcurrent);
  }

  getPurchaseTransaction(){ 
    this.loading = true; 
    this.userService.userLandContracts().pipe((finalize(() => {this.loading = false}))).subscribe(
      (response:any) => {
        
        this.container = response.transactions; 
        if((!this.count) && (response['count'])){
          this.count = response['count'];
        }
        this.generatePageNumbers( this.count  );  
        console.log(this.container,"AdminTransaction");
      },
      error => {
        // console.log(error);
      }
    )
  }




  intToDecimal (input:any){
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
            if(decimal && decimal.length > 0){
              decimal = '.' + decimal;
            }
            return intPart + '' + decimal;
    }

    isCorrectValue(currency:any, throwError:any, decimalsVal:any) {
      var parts = String(currency).trim().split('.');
      var amount = parts[0];
      var fraction = '';
    
      if (!throwError) throwError = false;
    
      function error(message:any) {
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

    fullTimestamp(time:any)

    {
     let d = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0));
     let t = parseInt((d.getTime() / 1000) +'');
   
     d = new Date((time + t) * 1000);
     let month = d.getMonth() + 1;
   
     if (month < 10) {
       month = parseInt("0" + month);
     }
   
     let day = d.getDate();
   
     if (day < 10) {
       day = parseInt("0" + day);
     }
   
     let h = d.getHours();
     let m = d.getMinutes();
     let s = d.getSeconds();
   
     if (h < 10) {
       h = parseInt("0" + h);
     }
   
     if (m < 10) {
       m = parseInt("0" + m);
     }
   
     if (s < 10) {
       s = parseInt("0" + s);
     }
   
     return day+'-'+month+'-'+d.getFullYear();
   }




   downloadpdf(){
    var doc = new jsPDF('p', 'pt');
    var columns = [
      {title: "Date", dataKey: "createdAt"},
      {title: "Txn Type", dataKey: "transactionType"}, 
      {title: "Amount", dataKey: "amount"},
      {title: "Mode of Payment", dataKey: "type"},
      {title: "Status", dataKey: "status"},
  ];
    doc.autoTable(columns, this.transform() );
    doc.save('Transaction Table.pdf');
  }

  downloadcsv(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      headers:['Date','Txn Type','Amount','Mode Of Payment','Status']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }

  transform() {
    let allowedFields = ['createdAt','transactionType','amount','type','status',]
    let temp = {};
    let transformed:any = []
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach(field => {
        if(field == 'createdAt'){
          temp[field] = new Date(transaction[field]).toLocaleDateString();
        } else {
          temp[field] = transaction[field]?transaction[field]: '-' ;
        }
      });
      transformed.push(temp) 
    });
    return transformed;
  }

  change(i:any){
    // console.log(this.container[i]._id)
    var toSend:boolean;
    if(this.action == "Confirm"){
      let item = this.container[i];
    var some = `<div class="topModel" style="text-align: left !important;"><div><b>No. of Coins:</b><input placeholder="Enter Coin"></input><br><button>Some Value</button>`+"</div></div>"
    swal({
      html: `
      <div class="topModel" style="text-align: left !important;">
          
          
          <div class="field">
              Enter Coin:
                  <input class="input" type="text" placeholder="No. of Coins">
                  <span class="icon is-small is-left">
                      <i class="mdi mdi-key"></i>
                  </span>
              </p>
          </div>
          
          </div>
      `,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'button is-success has-right-spacing',
      cancelButtonClass: 'button is-danger',
      buttonsStyling: true,
      allowOutsideClick : true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
            // get your inputs using their placeholder or maybe add IDs to them
            if($('input[placeholder="No. of Coins"]').val()){
              resolve({
                Coin: $('input[placeholder="No. of Coins"]').val()
            })
            }
            else{
              reject({
                
              })
            }
            
            // maybe also reject() on some condition
        });
    }
}).then((data:any) => {
    // your input data object will be usable from here
    if($('input[placeholder="No. of Coins"]').val()){
      let x=data.value.coin;
      // console.log(data.value.Coin);
      let payload = {
        'status':this.action.toLowerCase(), 
        'coins':this.isCorrectValue(data.value.Coin, true, 8)
      }
      
      this.userService.changeStatusTransactionAdminTran(this.container[i]._id, payload).subscribe(
        data => {
          this.getPurchaseTransaction();
          this.action="";
        },
        error => {
          this.getPurchaseTransaction();
          this.action="";
        }
      )}
    else{
      this.getPurchaseTransaction();
      this.action="";
      // console.log("Nothing");
    }
    
});}
  else{
     console.log("UpdatingStatusConfirm");
     console.log("UpdatingStatusConfirm",this.container[i]._id);
     console.log("UpdatingStatusConfirm",this.action);
    this.userService.changeStatusTransaction(this.container[i]._id, {'status':this.action}).subscribe(
        data => {
          this.getPurchaseTransaction();
          this.action="";
        },
        error => {
          this.getPurchaseTransaction();
          this.action="";
          // console.log(error);
        }
      )
  }

  }

  // status = ['Confirm', 'Pending', 'Cancel' ];

  popup(i:any){
    console.log("pop up hitting.");
    let item = this.container[i];
    console.log("item : ", item);
    if(item.receiverAccount){
      this.btcDetails(item);
    }
    else{
      this.wireDetails(item);
    }
  }

 
  btcDetails(item:any){
    let date = item.createdAt.split('T')[0];
    // console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div><b>Amount:</b>`+item.amount
    +"</div><br><div><b>Payment Mode:</b>"+item.type
    +"</div><br><div><b>Account Number:</b>"+item.receiverAccount
    +"</div><br><div><b>Date:</b>"+item.createdAt.split('T')[0]
    +"</div><br><div><b>Status:</b>"+item.status.toUpperCase()+"</div></div>"
    swal({
      title: '<strong> Transaction Details </strong>',
      html:some,
      width:800,
      padding:0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }

  wireDetails(item:any){
    let date = item.createdAt.split('T')[0];
    // console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div><b>Beneficiary Name:</b>`+item.bankAccount.beneficiary
    +"</div><br><div><b>Amount:</b>"+item.amount
    +"</div><br><div><b>Payment Mode:</b>"+item.type
    +"</div><br><div><b>Currency:</b>"+item.bankAccount.currency
    +"</div><br><div><b>Account Number:</b>"+item.bankAccount.number
    +"</div><br><div><b>Bank Name:</b>"+item.bankAccount.name
    +"</div><br><div><b>Swift Code:</b>"+item.bankAccount.swift
    +"</div><br><div><b>Transaction Type:</b>"+item.transactionType
    +"</div><br><div><b>Date:</b>"+date
    +"</div><br><div><b>Status:</b>"+item.status.toUpperCase()+"</div></div>"
    swal({
      title: '<strong> Transaction Details </strong>',
      html:some,
      width:800,
      padding:0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }

  search(){
    if(this.description.length>3){
      this.userService.getPurchaseTransaction(this.perPage, this.currentPage, this.description).subscribe(
        data => {
          // console.log(data);
          this.container = data['transactions'];
        },
        error => {
          // console.log(error);
        }
      )
      // console.log('search',this.description);
      
    }
    // else{
    //   this.container=this.store;
    // }

    // if(this.description.length > 3){
    //   // this.container=this.bucket;
    //   this.container = this.bucket
    // }
    // else{
    //   this.container = this.data;
    // }
  }

  key: string = 'name'; //set default
   reverse: boolean = false;
   sort(key:any){
     this.key = key;
     this.reverse = !this.reverse;
   }
   
   setActive() {
    let li = document.getElementsByClassName('navlist1');
    // console.log(this.currentPage, "current pagwe");
    console.log(li, "lisssss");
    for(let i =0; i<this.pageNumbers.length; i++) {
      // console.log(i ,"working for");
      
      if(i == this.currentPage) {
        li[i].classList.add('active')
      } else {
        li[i].classList.remove('active');
      }

    }
  }

   pageChange(value?: any) {
    // this.setActive();
    
    if(value) {
      // console.log("CLIK on page number");
      
      this.currentPage = value? value: this.currentPage++;
    } else if( (this.currentPage + 1) <= this.pageNumbers.length){
      // console.log("CLICK on next");
      
      this.currentPage++;
    }
    this.userService.getPurchaseTransaction(this.perPage, this.currentPage, this.status).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.container = res['transactions'];
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
    this.userService.getPurchaseTransaction(this.perPage,1, this.status).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.currentPage = 1;
      this.container = res['transactions'];
      // console.log(this.container);
      
      // this.setActive();
    });
  }
}