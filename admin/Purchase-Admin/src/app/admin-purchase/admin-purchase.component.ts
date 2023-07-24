import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../Services/user.service';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import swal from 'sweetalert2';
declare var jsPDF: any;
import 'jspdf-autotable';
import currency  from './currency';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-admin-purchase',
  templateUrl: './admin-purchase.component.html', 
  styleUrls: ['./admin-purchase.component.scss']
})
export class AdminPurchasecryptoComponent implements OnInit {

    
  public selectedValue:any="";
  public changeData:string;
  public description:any;
  public isOver=false;
  // public container:any; 
  // public store : any;

  // public btc:string;
  public accountName:string;
  // public accountNumber:string;
  // public ifsc:string;
  // public swift:string;
  // public accountAddress:string;
  // public currencies = currency;
  
  p: number = 1;
  
  public purchaseCoinForm: FormGroup;
  public btcForm:FormGroup;
  public wireForm:FormGroup;
  transactions:any = [];
  errorMsg = '';
  count:any = '';
  public loading = false;
  columns = ['Date', 'Description', 'Txn Type', 'Amount (Fiat/BTC/Weight)', 'Mode of Payment', 'Account used', 'Status']
  
  public filterPayload = { search : '' }
  public perPage:number=50;
  currentPage=1;
  pageNumbers = [1];
  status: string;

  constructor( 
    public userService : UserService,
    public dataService : UserService, 
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private socket: Socket
  ) {
    this.purchaseCoinForm = this.formBuilder.group({
      // currency: ['usd', Validators.compose([Validators.required, Validators.min(1)]) ],
      type: ['', Validators.compose([Validators.required, Validators.min(1)]) ],
      uniqueId: ['', Validators.compose([Validators.required, Validators.min(1)]) ],
      amount:['', Validators.compose([Validators.required, Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      usremail: ['', Validators.compose([Validators.required, Validators.min(1)]) ],
      // receiverAccount: ['', Validators.compose([Validators.required, Validators.min(1)]) ],
    });

    this.btcForm = this.formBuilder.group({
      walletAddress:['', Validators.compose([Validators.required])],
    })

    this.wireForm = this.formBuilder.group({
      beneficiary : ['', Validators.compose([Validators.required])],
      accountNumber:['', Validators.compose([Validators.required])],
      swiftCode : ['', Validators.compose([Validators.required])],
      bankName : ['', Validators.compose([Validators.required])],
      currencyType: ['', Validators.compose([Validators.required])]
    })



   }

  ngOnInit() {
    this.getTransactions();
    this.dataService.getAccountInfo().subscribe(
      (data:any) => {
        console.log(data);
        //this.btc=data.btcWalletAddress;
        this.accountName=data.accountName;
        // this.accountNumber=data.accountNumber;
        // this.ifsc=data.accountIfsc;
        // this.swift=data.accountSwift;
        // this.accountAddress=data.accountAddress;
      },
      error => {
        console.log(error);
      }
    )

    // this.accountForm.patchValue({
    //   btc: data.btcWalletAddress,
      
    // });
  }

  getTransactions(){
    this.userService.getPurchaseTransactionAdmin(this.perPage, this.currentPage, this.filterPayload).subscribe( res => {
      this.transactions = res['transactions'];
      if((!this.count) && (res['count'])){
        this.count = res['count']
      }
      this.generatePageNumbers( this.count  );
      // this.setActive();
    });
  }

  paymentModeChanged(){
    console.log('resetting');
    
    if(this.purchaseCoinForm.value.type == 'btc'){
      this.wireForm.reset();
      
    }
    else{
      if(this.purchaseCoinForm.value.type == 'wire'){
        this.btcForm.reset();
      }
    }
  }

  submitForm() {
    this.errorMsg = '';
    this.loading=true;
    let payload2 = {
      'uniqueId':this.purchaseCoinForm.value.uniqueId,
      'type':this.purchaseCoinForm.value.type,
      'amount':this.purchaseCoinForm.value.amount,
      'isAdminPurchase':true,
      'useremail':this.purchaseCoinForm.value.usremail,//usremail
      'receiverAccount':this.btcForm.value.walletAddress,
      'bankAccount': {
        'name': this.wireForm.value.bankName,
        'number': this.wireForm.value.accountNumber,
        'swift': this.wireForm.value.swiftCode,
        'beneficiary':this.wireForm.value.beneficiary,
        'currency':this.wireForm.value.currencyType
      }
    }

    if(this.purchaseCoinForm.value.type == 'btc'){
      delete payload2['bankAccount'];
    }
    else{
      delete payload2['receiverAccount'];
    }

    // delete payload[]
    console.log(payload2,'Payload2');
    
    this.dataService.purchaseCoin(payload2).subscribe( res => {
      console.log(res, "transaction created");
      this.purchaseCoinForm.reset();
      this.btcForm.reset();
      this.wireForm.reset();
      this.getTransactions();
      this.showSuccess('Request Created Successfully');
      this.socket.emit('create notification','Notification Test');
      this.loading=false;
    }, (error) => {
      this.loading=false;
      this.showError(error.error.message);
      // console.log(error, "errorrrrr");
      this.errorMsg = error.error.message;
    })
    // console.log(this.purchaseCoinForm.value, "form Purchase");
    // console.log(this.btcForm.value, "form BTC");
    // console.log(this.wireForm.value, "form Purchase");
    
  }
  downloadpdf(){
    var doc = new jsPDF('p', 'pt');
    var columns = [
      {title: "Date", dataKey: "createdAt"},
      {title: "Description", dataKey: "remarks"},
      {title: "Txn Type", dataKey: "transactionType"}, 
      {title: "Amount", dataKey: "amount"},
      {title: "Mode of Payment", dataKey: "type"},
      {title: "Status", dataKey: "status"},
  ];
  console.log(this.transactions, "this");
  
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
      headers:['Date','Description','Txn Type','Amount','Mode Of Payment','Status']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }

  transform() {
    let allowedFields = ['createdAt','remarks','transactionType','amount','type','status',]
    let temp = {};
    let transformed:any = []
    this.transactions.forEach((transaction: any) => {
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

  perPageChange() {
    this.dataService.getPurchaseCoin(this.perPage,1, this.status).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.currentPage = 1;
      this.transactions = res['transactions'];
      // this.setActive();
    });
  }

  pageChange(value?: any) {
    // this.setActive();
    
    if(value) {
      console.log("CLIK on page number");
      
      this.currentPage = value? value: this.currentPage++;
    } else if( (this.currentPage + 1) <= this.pageNumbers.length){
      console.log("CLICK on next");
      
      this.currentPage++;
    }
    this.dataService.getPurchaseCoin(this.perPage, this.currentPage, this.status).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.transactions = res['transactions'];
    });
  }
  setActive() {
    let li = document.getElementsByClassName('navlist1');
    console.log(this.currentPage, "current pagwe");
    console.log(li, "lisssss");
    for(let i =0; i<this.pageNumbers.length; i++) {
      console.log(i ,"working for");
      
      if(i == this.currentPage) {
        li[i].classList.add('active')
      } else {
        li[i].classList.remove('active');
      }

    }
  }
  statusChange() {
    this.dataService.getPurchaseCoin(this.perPage,1, this.status).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.currentPage = 1;
      this.transactions = res['transactions'];
    });
  }

  generatePageNumbers(value:any) {
    let limit = Math.ceil( (value/this.perPage) );
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for(let i=1; i<=limit; i++) {
      this.pageNumbers.push(i);
    }
  }

  open(){
    console.log(this.perPage);
  }

  show(){
    console.log("In show");
  }

  showError(data:string){
    swal({
      type: 'error',
      text: data,
      timer:2000
    })
  }

  showSuccess(data:string){
    swal({
      type: 'success',
      text: data,
      timer:2000
    })
  }

  showPopup(item:any){
    if(item.type=='wire'){
      this.showWireDetails(item);
    }
    if(item.type=='btc'){
      this.showBtcDetails(item);
    }
    if(item.type=='gold'){
      this.showGoldDetails(item);
    }else {
      this.showBtcDetails(item);
    }
  }

  showWireDetails(item:any){
    let date = item.createdAt.split('T')[0];
    console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div class='row'><div class='col-6'><b>Amount:</b></div><div class="col-6">`+item.amount
    +"</div></div><br><div class='row'><div class='col-6'><b>Name:</b></div><div class='col-6'>"+item.bankAccount.beneficiary
    +"</div></div><br><div class='row'><div class='col-6'><b>Bank Name:</b></div><div class='col-6'>"+item.bankAccount.name
    +"</div></div><br><div class='row'><div class='col-6'><b>Swift Code:</b></div><div class='col-6'>"+item.bankAccount.swift
    +"</div></div><br><div class='row'><div class='col-6'><b>Payment Mode:</b></div><div class='col-6'>"+item.type
    +"</div></div><br><div class='row'><div class='col-6'><b>Currency:</b></div><div class='col-6'>"+item.bankAccount.currency
    +"</div></div><br><div class='row'><div class='col-6'><b>Account Number:</b></div><div class='col-6'>"+item.bankAccount.number
    +"</div></div><br><div class='row'><div class='col-6'><b>Date:</b></div><div class='col-6'>"+item.createdAt.split('T')[0]
    +"</div></div><br><div class='row'><div class='col-6'><b>Status:</b></div><div class='col-6'>"+item.status.toUpperCase()+"</div></div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
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

  showBtcDetails(item:any){
    let date = item.createdAt.split('T')[0];
    console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div class='row'><div class='col-6'><b>Amount:</b></div><div class='col-6'>`+item.amount
    +"</div></div><br><div class='row'><div class='col-6'><b>Payment Mode:</b></div><div class='col-6'>"+item.type
    +"</div></div><br><div class='row'><div class='col-6'><b>Account Number:</b></div><div class='col-6'>"+item.receiverAccount
    +"</div></div><br><div class='row'><div class='col-6'><b>Date:</b></div><div class='col-6'>"+item.createdAt.split('T')[0]
    +"</div></div><br><div class='row'><div class='col-6'><b>Status:</b></div><div class='col-6'>"+item.status.toUpperCase()+"</div></div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
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

  showGoldDetails(item:any){
    let date = item.createdAt.split('T')[0];
    console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div class='row'><div class='col-6'><b>Weight/Carat:</b></div><div class='col-6'>`+item.amount
    +"</div></div><br><div class='row'><div class='col-6'><b>Payment Mode:</b></div><div class='col-6'>"+item.type
    +"</div></div><br><div class='row'><div class='col-6'><b>Account Number:</b></div><div class='col-6'>"+item.receiverAccount
    +"</div></div><br><div class='row'><div class='col-6'><b>Date:</b></div><div class='col-6'>"+item.createdAt.split('T')[0]
    +"</div></div><br><div class='row'><div class='col-6'><b>Status:</b></div><div class='col-6'>"+item.status.toUpperCase()+"</div></div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
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

 
}
