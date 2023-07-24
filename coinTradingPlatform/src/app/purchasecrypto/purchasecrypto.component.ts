import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import swal from 'sweetalert2';
declare var jsPDF: any;
import 'jspdf-autotable';
import currency from './currency';
import { Socket } from 'ng-socket-io';
import { finalize } from 'rxjs/operators';

// import { ConsoleReporter } from 'jasmine';
// import { Console } from 'console';

@Component({
  selector: 'app-purchasecrypto',
  templateUrl: './purchasecrypto.component.html',
  styleUrls: ['./purchasecrypto.component.scss']
})
export class PurchasecryptoComponent implements OnInit {

  public selectedValue: any = "";
  public changeData: string;
  public description: any;
  public isOver = false;
  // public container:any; 
  // public store : any;

  public btc: string;
  public accountName: string;
  public accountNumber: string;
  public ifsc: string;
  public swift: string;
  public accountAddress: string;
  public currencies = currency;

  public bitoroPrice: any;
  public btcPrice: any;
  public bitorobtc: any;


  p: number = 1;

  public purchaseCoinForm: FormGroup;
  public btcForm: FormGroup;
  public goldForm: FormGroup;
  public wireForm: FormGroup;
  public cashForm: FormGroup;
  transactions: any = [];
  errorMsg = '';

  columns = ['Date', 'Description', 'Txn Type', 'Amount (Fiat/BTC)', 'Mode of Payment', 'Account used', 'Status']

  public perPage: number = 5;
  currentPage = 1;
  pageNumbers = [1];
  status: string;
  count: number = 0;
  loading = true;
  public submitLoader = false;

  constructor(
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private socket: Socket
  ) {
    // this.socket=
    this.purchaseCoinForm = this.formBuilder.group({
      // currency: ['usd', Validators.compose([Validators.required, Validators.min(1)]) ],
      type: ['', Validators.compose([Validators.required, Validators.min(1)])],
      uniqueId: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.min(1)])],
      // amount: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      // receiverAccount: ['', Validators.compose([Validators.required, Validators.min(1)]) ],
    });

    this.btcForm = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      walletAddress: ['', Validators.compose([Validators.required, Validators.minLength(25), Validators.maxLength(36), Validators.pattern('[a-zA-Z,0-9 ]*')])]
    })

    this.goldForm = this.formBuilder.group({
      carat: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      name: ['', Validators.compose([Validators.required, Validators.min(10)])],
      address: ['', Validators.compose([Validators.required, Validators.min(10)])],
      number: ['', Validators.compose([Validators.required, Validators.min(10)])],
      // amount:['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      weight: ['', Validators.compose([Validators.required])]
    })

    // this.wireForm = this.formBuilder.group({
    //   amount: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
    //   beneficiary : ['', Validators.compose([Validators.required,Validators.maxLength(30), Validators.minLength(4)])],
    //   accountNumber:['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
    //   swiftCode : ['', Validators.compose([Validators.required,Validators.maxLength(15), Validators.minLength(8)])],
    //   bankName : ['', Validators.compose([Validators.required,Validators.maxLength(30), Validators.minLength(2)])],
    //   currencyType: ['', Validators.compose([Validators.required,Validators.maxLength(25), Validators.minLength(1)])]
    // })

    this.wireForm = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      beneficiary: ['', Validators.compose([Validators.required])],
      accountNumber: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])],
      swiftCode: ['', Validators.compose([Validators.required])],
      bankName: ['', Validators.compose([Validators.required])],
      currencyType: ['', Validators.compose([Validators.required])]
    })

    this.cashForm = this.formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      name: ['', Validators.compose([Validators.required, Validators.min(10)])],
      number: ['', Validators.compose([Validators.required, Validators.min(10)])],
      address: ['', Validators.compose([Validators.required, Validators.min(10)])],
      currency: ['', Validators.compose([Validators.required])]
    })

  }

  ngOnInit() {
    this.socket.connect();
    // console.log('this.socket.connect()',this.socket.connect())
    this.getTransactions();
    this.dataService.getAccountInfo().subscribe(
      (data: any) => {

        //this section provides admin account details
        this.btc = data.btcWalletAddress;
        this.accountName = data.accountName;
        this.accountNumber = data.accountNumber;
        this.ifsc = data.accountIfsc;
        this.swift = data.accountSwift;
        this.accountAddress = data.accountAddress;
      },
      error => {
        console.log(error);
      }
    )

    this.dataService.getGoldPrice().subscribe(
      (data: any) => {

        //this section give gold and bitoro rates

        this.bitoroPrice = data.goldprice;
        this.btcPrice = data.btcprice;
        this.bitorobtc = data.bitorobtc;

      },
      error => {
        console.log(error);
      }
    )

    // this.accountForm.patchValue({
    //   btc: data.btcWalletAddress,

    // });
  }

  getTransactions() {

    //this section gives all purchase transasctions from current user to admin
    this.loading = true;
    this.dataService.getPurchaseCoin().pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.transactions = res['transactions'];
      if ((!this.count) && (res['count'])) {
        this.count = res['count'];
      }
      this.generatePageNumbers(this.count);
      // this.setActive();
    });
  }

  paymentModeChanged() {
    console.log('resetting');
    this.purchaseCoinForm.reset(this.purchaseCoinForm.value);
    // this.purchaseCoinForm.patchValue({ amount : '' });

    if (this.purchaseCoinForm.value.type == 'btc') {
      this.wireForm.reset();
      this.goldForm.reset();
      this.cashForm.reset();
      this.cashForm.patchValue({
        currency: ''
      })
    }
    else if (this.purchaseCoinForm.value.type == 'gold') {
      this.wireForm.reset();
      this.btcForm.reset();
      this.cashForm.reset();
      this.cashForm.patchValue({
        currency: ''
      })
    }
    else {
      if (this.purchaseCoinForm.value.type == 'wire') {
        this.btcForm.reset();
        this.goldForm.reset();
        this.cashForm.reset();
        this.cashForm.patchValue({
          currency: ''
        })
      }
      else {
        if (this.purchaseCoinForm.value.type == 'cash') {
          this.btcForm.reset();
          this.goldForm.reset();
          this.wireForm.reset();
        }
      }
    }
  }

  submitForm() {
    this.submitLoader = true;
    this.errorMsg = '';
    let payload2 = {
      'uniqueId': this.purchaseCoinForm.value.uniqueId,
      'type': this.purchaseCoinForm.value.type,
      //'amount': this.purchaseCoinForm.value.amount,
      'isAdminPurchase': false,
      'receiverAmount': this.btcForm.value.amount,
      'receiverAccount': this.btcForm.value.walletAddress,
      'bankAccount': {
        'amount': this.wireForm.value.amount,
        'name': this.wireForm.value.bankName,
        'number': this.wireForm.value.accountNumber,
        'swift': this.wireForm.value.swiftCode,
        'beneficiary': this.wireForm.value.beneficiary,
        'currency': this.wireForm.value.currencyType
      },
      'goldDetails': {
        carat: this.goldForm.value.carat,
        name: this.goldForm.value.name,
        departureAddress: this.goldForm.value.address,
        contactNumber: this.goldForm.value.number,
        weight: this.goldForm.value.weight
      },
      'cash': {
        amount: this.cashForm.value.amount,
        name: this.cashForm.value.name,
        number: this.cashForm.value.number,
        address: this.cashForm.value.address,      // Physical address
        currency: this.cashForm.value.currency
      },
      'transactionType': 'purchase'

    }

    if (this.purchaseCoinForm.value.type == 'btc') {
      delete payload2['bankAccount'];
      delete payload2['goldDetails'];
      delete payload2['cash'];
      payload2['amount'] = this.btcForm.value.amount
    }
    else if (this.purchaseCoinForm.value.type == 'gold') {
      delete payload2['bankAccount'];
      delete payload2['receiverAccount'];
      delete payload2['cash'];
      payload2['amount'] = this.goldForm.value.weight
      payload2['carat'] = this.goldForm.value.carat
    }
    else if (this.purchaseCoinForm.value.type == 'wire') {
      delete payload2['receiverAccount'];
      delete payload2['goldDetails'];
      delete payload2['cash'];
      payload2['amount'] = this.wireForm.value.amount
    }
    else {
      delete payload2['receiverAccount'];
      delete payload2['goldDetails'];
      delete payload2['bankAccount'];
      payload2['amount'] = this.cashForm.value.amount
    }

    // delete payload[]
    this.dataService.purchaseCoin(payload2).subscribe((res: any) => {
      this.purchaseCoinForm.reset();
      this.purchaseCoinForm.patchValue({ type: '' });
      this.btcForm.reset();
      this.goldForm.reset();
      this.wireForm.reset();
      this.cashForm.reset();
      this.submitLoader = false;
      this.getTransactions();
      this.showSuccess('Request Created Successfully');
      console.log("Socket info : ", this.socket);
      this.socket.emit('usernotification', { type: 'PURCHASE' });
    }, (error) => {
      this.showError(error.error.message);
      this.errorMsg = error.error.message;
      this.submitLoader = false;
    })

  }


  downloadpdf() {
    var doc = new jsPDF('p', 'pt');
    var columns = [
      { title: "Date", dataKey: "createdAt" },
      { title: "Description", dataKey: "remarks" },
      { title: "Txn Type", dataKey: "transactionType" },
      { title: "Amount", dataKey: "amount" },
      { title: "Mode of Payment", dataKey: "type" },
      { title: "Status", dataKey: "status" },
    ];
    console.log(this.transactions, "this");

    doc.autoTable(columns, this.transform());
    doc.save('Transaction Table.pdf');
  }

  downloadcsv() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      headers: ['Date', 'Description', 'Txn Type', 'Amount', 'Mode Of Payment', 'Status']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }

  transform() {
    let allowedFields = ['createdAt', 'remarks', 'transactionType', 'amount', 'type', 'status',]
    let temp = {};
    let transformed: any = []
    this.transactions.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach(field => {
        if (field == 'createdAt') {
          temp[field] = new Date(transaction[field]).toLocaleDateString();
        } else {
          temp[field] = transaction[field] ? transaction[field] : '-';
        }
      });
      transformed.push(temp)
    });
    return transformed;
  }

  perPageChange() {
    this.loading = true;
    this.dataService.getPurchaseCoin(this.perPage, 1, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.currentPage = 1;
      this.transactions = res['transactions'];
      // this.setActive();
    });
  }

  pageChange(value?: any) {
    // this.setActive();

    if (value) {
      console.log("CLIK on page number");

      this.currentPage = value ? value : this.currentPage++;
    } else if ((this.currentPage + 1) <= this.pageNumbers.length) {
      console.log("CLICK on next");

      this.currentPage++;
    }
    this.loading = true;
    this.dataService.getPurchaseCoin(this.perPage, this.currentPage, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.transactions = res['transactions'];
    });
  }
  setActive() {
    let li = document.getElementsByClassName('navlist1');
    console.log(this.currentPage, "current pagwe");
    console.log(li, "lisssss");
    for (let i = 0; i < this.pageNumbers.length; i++) {
      console.log(i, "working for");

      if (i == this.currentPage) {
        li[i].classList.add('active')
      } else {
        li[i].classList.remove('active');
      }

    }
  }
  statusChange() {
    this.loading = true;

    this.dataService.getPurchaseCoin(this.perPage, 1, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.currentPage = 1;
      this.transactions = res['transactions'];
    });
  }

  generatePageNumbers(value: any) {
    let limit = Math.ceil((value / this.perPage));
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
    }
  }

  open() {
    console.log(this.perPage);
  }

  show() {
    console.log("In show");
  }

  showError(data: string) {
    swal({
      type: 'error',
      text: data,
      timer: 2000
    })
  }

  showSuccess(data: string) {
    swal({
      type: 'success',
      text: data,
      timer: 2000
    })
  }

  showPopup(item: any) {
    if (item.type == 'wire') {
      this.showWireDetails(item);
    }
    if (item.type == 'gold') {
      this.showGoldDetails(item);
    }
    if (item.type == 'btc') {
      this.showBtcDetails(item);
    }
    if (item.type == 'cash') {
      this.showCashDetails(item);
    }
  }

  showWireDetails(item: any) {
    let date = item.createdAt.split('T')[0];
    console.log("ITEM", item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div class='row'><div class='col-6'><b>Invoice Number:</b></div><div class="col-6">` + item.transactionId
      + "</div></div><br><div class='row'><div class='col-6'><b>Name:</b></div><div class='col-6'>" + item.bankAccount.beneficiary
      + "</div></div><br><div class='row'><div class='col-6'><b>Bank Name:</b></div><div class='col-6'>" + item.bankAccount.name
      + "</div></div><br><div class='row'><div class='col-6'><b>Swift Code:</b></div><div class='col-6'>" + item.bankAccount.swift
      + "</div></div><br><div class='row'><div class='col-6'><b>Payment Mode:</b></div><div class='col-6'>" + item.type
      + "</div></div><br><div class='row'><div class='col-6'><b>Currency:</b></div><div class='col-6'>" + item.bankAccount.currency
      + "</div></div><br><div class='row'><div class='col-6'><b>Account Number:</b></div><div class='col-6'>" + item.bankAccount.number
      + "</div></div><br><div class='row'><div class='col-6'><b>Date:</b></div><div class='col-6'>" + item.createdAt.split('T')[0]
      + "</div></div><br><div class='row'><div class='col-6'><b>Status:</b></div><div class='col-6'>" + item.status.toUpperCase()
      + "</div></div><br><div class='row'><div class='col-6'><b>Fiat Amount:</b></div><div class='col-6'>" + item.amount + "</div></div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }

  showBtcDetails(item: any) {
    let date = item.createdAt.split('T')[0];
    console.log("ITEM", item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div class='row'><div class='col-6'><b>Invoice Number:</b></div><div class='col-6'>` + item.transactionId
      + "</div></div><br><div class='row'><div class='col-6'><b>Payment Mode:</b></div><div class='col-6'>" + item.type
      + "</div></div><br><div class='row'><div class='col-6'><b>Account Number:</b></div><div class='col-6'>" + item.receiverAccount
      + "</div></div><br><div class='row'><div class='col-6'><b>Date:</b></div><div class='col-6'>" + item.createdAt.split('T')[0]
      + "</div></div><br><div class='row'><div class='col-6'><b>Status:</b></div><div class='col-6'>" + item.status.toUpperCase()
      + "</div></div><br><div class='row'><div class='col-6'><b>BTC Amount:</b></div><div class='col-6'>" + item.amount + "</div></div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }

  showCashDetails(item: any) {
    let date = item.createdAt.split('T')[0];
    console.log("ITEM", item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div><b>Invoice Number:</b>` + item.transactionId
      + "</div><br><div><b>Payment Mode:</b>" + item.type
      + "</div><br><div><b>Name:</b>" + item.cash.name
      + "</div><br><div><b>Number:</b>" + item.cash.number
      + "</div><br><div><b>Address:</b>" + item.cash.address
      + "</div><br><div><b>Currency:</b>" + item.cash.currency
      + "</div><br><div><b>Date:</b>" + item.createdAt.split('T')[0]
      + "</div><br><div><b>Status:</b>" + item.status.toUpperCase()
      + "</div><br><div><b>Fiat Amount:</b>" + item.amount + "</div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }
  showGoldDetails(item: any) {
    let date = item.createdAt.split('T')[0];
    console.log("ITEM", item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some = `<div class="topModel" style="text-align: left !important;"><div><b>Carat:</b>` + item.goldDetails.carat
      + "</div><br><div><b>Payment Mode:</b>" + item.type
      + "</div><br><div><b>Address:</b>" + item.goldDetails.departureAddress
      + "</div><br><div><b>Name:</b>" + item.goldDetails.name
      + "</div><br><div><b>Weight:</b>" + item.goldDetails.weight
      + "</div><br><div><b>Number:</b>" + item.goldDetails.contactNumber
      + "</div><br><div><b>Date:</b>" + item.createdAt.split('T')[0]
      + "</div><br><div><b>Status:</b>" + item.status.toUpperCase()
      + "</div><br><div><b>Gold Amount in g :</b>" + item.transactionId + "</div></div>"
    swal({
      title: '<strong> Purchase Details </strong>',
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: 'sweetalert-lg',
    })
  }


}
