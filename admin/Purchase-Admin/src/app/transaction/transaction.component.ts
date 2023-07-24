import { Component, OnInit } from "@angular/core";
import { UserService } from "../../Services/user.service";
import { Router } from "@angular/router";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
declare var jsPDF: any;
import "jspdf-autotable";
import swal from "sweetalert2";
declare var jquery: any;
declare var $: any;
// import { $ } from 'protractor';
import { Socket } from "ng-socket-io";
import { SharedService } from "Services/shared.services";
import baseUrl from "../../../BaseUrl";

import { FileUploader } from "ng2-file-upload";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.css"],
})
export class TransactionComponent implements OnInit {
  public selectedValue: any = "";
  public selectedName: any = "";
  public description: any;

  public baseurlip = baseUrl;
  public URL = baseUrl + "/transactionscontract/profileImageUploadMultiple";
  public uploader: any;
  public cnt = 0;
  public filesUpName: Array<string> = [];
  public coins: any;
  public display = false;
  public index = 0;

  p: number = 1;
  public perPage: number = 50;
  public container: any;
  public action: string = "";
  public bitoroPrice: any; // Price of 1 BITORO in EURO
  public bitorobtc: any; // Price of 1 BITORO in BTC
  public btcPrice: any; // Price of 1 Btc in Euro
  public fiatCurrencyRate: any;
  public loading = false;
  pageNumbers = [1];
  currentPage = 1;
  status: string;

  public filterPayload = { search: "" };

  count: any = "";

  constructor(
    public userService: UserService,
    public router: Router,
    private socket: Socket,
    public sharedService: SharedService
  ) {
    this.uploader = new FileUploader({ url: this.URL, itemAlias: "files" });

    this.uploader.onBeforeUploadItem = (item: any) => {
      item.withCredentials = false;
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.cnt++;

      this.filesUpName.push(JSON.parse(response)[0].path);

      if (this.uploader.queue.length == this.cnt) {
        // sending other data to server -----------------------
        this.changeStatus();
      }
    };

    // this.socket.on('new notification', function(data){
    //   let value = 0;
    //   // console.log("ADMIN SOCKET");
    //   // alert(data);
    //   // let parsedData = JSON.parse(data);

    //   if(data.type == 'SELL'){
    //     if(localStorage.getItem('purchaseNotify')){
    //       value = parseInt(localStorage.getItem('purchaseNotify'));
    //     }
    //     ++value;
    //     // console.log('Value = ',value);
    //     sharedService.updateNotification({ type : 'PURCHASE', value : value })

    //     localStorage.setItem('purchaseNotify', JSON.stringify(value));
    //   }
    //  });
  }

  ngOnInit() {
    this.userService.getCurrencyRate().subscribe(async (data: any) => {
      this.fiatCurrencyRate = await data.data.rates;
    });

    this.userService.getGoldPrice().subscribe(
      async (data: any) => {
        this.bitoroPrice = data.goldprice;
        this.btcPrice = data.btcprice;
        // this.btcPrice = Number(this.btcPrice)
        this.bitorobtc = data.bitorobtc;
      },
      (error) => {
        console.log(error);
      }
    );
    localStorage.removeItem("purchaseNotify");
    this.sharedService.updateNotification({ type: "PURCHASE", value: 0 });
    this.getPurchaseTransaction();

    // alert('skdshdj')
  }

  searchCall() {
    if (this.description.length > 2) {
      this.filterPayload["receiverId"] = this.description;
      this.currentPage = 1;
      this.getPurchaseTransaction();
    } else {
      if (this.description.length == 2) {
        this.filterPayload["receiverId"] = "";
        this.currentPage = 1;
        this.getPurchaseTransaction();
      }
    }
  }

  getPurchaseTransaction() {
    console.log("params to check : ", this.perPage, this.currentPage, this.filterPayload);
    this.userService
      .getPurchaseTransactionAdmin(
        this.perPage,
        this.currentPage,
        this.filterPayload
      )
      .subscribe(
        (response: any) => {
          console.log("Data------------", response);
          this.container = response.transactions;
          this.count = response["count"];
          this.generatePageNumbers(this.count);
        },
        (error) => {
          // console.log(error);
        }
      );
  }

  intToDecimal(input: any) {
    if (!input) {
      return "0.0";
    }

    input = input.toString();

    while (input.length < 9) {
      input = "0".concat(input);
    }

    var intPart = input.slice(0, -8);
    var decimal = input.slice(-8);

    var clearView = false;

    while (!clearView) {
      if (decimal[decimal.length - 1] == "0") {
        decimal = decimal.slice(0, decimal.length - 1);
      } else {
        clearView = true;
      }
    }
    if (decimal && decimal.length > 0) {
      decimal = "." + decimal;
    }
    return intPart + "" + decimal;
  }

  isCorrectValue(currency: any, throwError: any, decimalsVal: any) {
    var parts = String(currency).trim().split(".");
    var amount = parts[0];
    var fraction = "";

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

    if (amount == "") {
      return error("Crypto amount can not be blank");
    }

    if (parts.length == 1) {
      // No fractional part
      for (let k = 0; k < decimalsVal; k++) {
        fraction = fraction + "0";
      }
    } else if (parts.length == 2) {
      if (parts[1].length > 8) {
        return error("Crypto amount must not have more than 8 decimal places");
      } else if (parts[1].length <= 8) {
        // Less than eight decimal places
        fraction = parts[1];
      } else {
        // Trim extraneous decimal places
        fraction = parts[1].substring(0, 8);
      }
    } else {
      return error("Crypto amount must have only one decimal point");
    }

    // Pad to eight decimal places
    for (var i = fraction.length; i < 8; i++) {
      fraction += "0";
    }

    // Check for zero amount
    if (amount == "0" && fraction == "00000000") {
      return error("Crypto amount can not be zero");
    }

    // Combine whole with fractional part
    var result = amount + fraction;

    // In case there's a comma or something else in there.
    // At this point there should only be numbers.
    if (!/^\d+$/.test(result)) {
      return error("Crypto amount contains non-numeric characters");
    }

    // Remove leading zeroes
    result = result.replace(/^0+/, "");

    return parseInt(result);
  }

  fullTimestamp(time) {
    let d = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0));
    let t = parseInt(d.getTime() / 1000 + "");

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

    return day + "-" + month + "-" + d.getFullYear();
  }

  downloadpdf() {
    var doc = new jsPDF("p", "pt");
    var columns = [
      { title: "Date", dataKey: "createdAt" },
      { title: "Txn Type", dataKey: "transactionType" },
      { title: "Amount", dataKey: "amount" },
      { title: "Mode of Payment", dataKey: "type" },
      { title: "Status", dataKey: "status" },
    ];
    doc.autoTable(columns, this.transform());
    doc.save("Transaction Table.pdf");
  }

  downloadcsv() {
    var options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      headers: ["Date", "Txn Type", "Amount", "Mode Of Payment", "Status"],
    };

    new Angular2Csv(this.transform(), "Transaction Table", options);
  }

  transform() {
    let allowedFields = [
      "createdAt",
      "transactionType",
      "amount",
      "type",
      "status",
    ];
    let temp = {};
    let transformed: any = [];
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach((field) => {
        if (field == "createdAt") {
          temp[field] = new Date(transaction[field]).toLocaleDateString();
        } else {
          temp[field] = transaction[field] ? transaction[field] : "-";
        }
      });
      transformed.push(temp);
    });
    return transformed;
  }

  convertToEuro(currency: any, coin: any) {
    // console.log("convertToEuro----------", currency, this.fiatCurrencyRate[currency], coin)
    if (currency != "Euro") {
      return coin * (1 / this.fiatCurrencyRate[currency]);
    } else {
      return coin;
    }
  }

  // change status for Confirm
  changeStatus() {
    let payload = {
      status: this.action.toLowerCase(),
      coins: this.isCorrectValue(this.coins, true, 8),
      picture: this.filesUpName,
    };
    console.log("Payload coin: ", this.coins);
    console.log("payload>>>>>>>...", payload, this.container[this.index]);
    this.userService
      .changeStatusTransactionUser(this.container[this.index]._id, payload)
      .subscribe(
        (data) => {
          this.getPurchaseTransaction();
          this.action = "";
        },
        (error) => {
          this.getPurchaseTransaction();
          this.action = "";
        }
      );

    this.display = false;
    this.close();
  }

  uploadImages() {
    console.log("File Upload>>>>>>>", this.uploader);

    if (this.uploader.queue.length > 0) {
      this.uploader.uploadAll();
    } else {
      this.changeStatus();
    }
  }

  change(i, e) {
    console.log("event--------", i, e.target.value);
    var toSend: boolean;
    var bitoro;
    this.action = e.target.value;
    this.index = i;
    let item = this.container[i];
    console.log("item : ", item);
    if (item.type == "btc") {
      bitoro = item.amount / this.bitorobtc;
    }
    if (item.type == "gold") {
      bitoro = item.amount * this.bitoroPrice;
    }
    if (item.type == "wire") {
      bitoro =
        this.convertToEuro(item.bankAccount.currency, item.amount) /
        this.bitoroPrice;
    }
    if (item.type == "cash") {
      bitoro =
        this.convertToEuro(item.cash.currency, item.amount) / this.bitoroPrice;
    }

    // this.display = true
    if (e.target.value == "Paid") {
      // Confirm
      this.coins = bitoro.toFixed(8);
      this.filesUpName = [];
      if (this.uploader && this.uploader.queue) {
        this.uploader.queue = [];
      }
      $("#myModal").modal("show");
    }
    // if(this.action == "Confirm"){
    //       let item = this.container[i];
    //     var some = `<div class="topModel" style="text-align: left !important;"><div><b>No. of Coins:</b><input placeholder="Enter Coin"></input><br><button>Some Value</button>`+"</div></div>"
    //     swal({
    //       html: `
    //       <div class="topModel" style="text-align: left !important;">

    //           <div class="field">
    //               Enter Coin:
    //                   <input class="input" type="text" placeholder="No. of Coins">
    //                   <span class="icon is-small is-left">
    //                       <i class="mdi mdi-key"></i>
    //                   </span>
    //               </p>
    //           </div>

    //           </div>
    //       `,
    //       confirmButtonText: 'Confirm',
    //       cancelButtonText: 'Cancel',
    //       confirmButtonClass: 'button is-success has-right-spacing',
    //       cancelButtonClass: 'button is-danger',
    //       buttonsStyling: true,
    //       allowOutsideClick : true,
    //       preConfirm: function() {
    //         return new Promise((resolve, reject) => {
    //             // get your inputs using their placeholder or maybe add IDs to them
    //             if($('input[placeholder="No. of Coins"]').val()){
    //               resolve({
    //                 Coin: $('input[placeholder="No. of Coins"]').val()
    //             })
    //             }
    //             else{
    //               reject({

    //               })
    //             }

    //             // maybe also reject() on some condition
    //         });
    //     }
    // }).then((data:any) => {
    //     // your input data object will be usable from here
    //     if($('input[placeholder="No. of Coins"]').val()){
    //       let x=data.value.coin;
    //       // console.log(data.value.Coin);
    //       let payload = {
    //         'status':this.action.toLowerCase(),
    //         'coins':this.isCorrectValue(data.value.Coin, true, 8)
    //       }
    //       console.log(payload);
    //       this.userService.changeStatusTransactionUser(this.container[i]._id, payload).subscribe(
    //         data => {
    //           this.getPurchaseTransaction();
    //           this.action="";
    //         },
    //         error => {
    //           this.getPurchaseTransaction();
    //           this.action="";
    //         }
    //       )}
    //     else{
    //       this.getPurchaseTransaction();
    //       this.action="";
    //       // console.log("Nothing");
    //     }

    // });
    // }
    else {
      console.log("UpdatingStatusConfirm");
      console.log("UpdatingStatusConfirm", this.container[i]._id);
      console.log("UpdatingStatusConfirm", e.target.value);
      this.loading = true;
      this.userService
        .changeStatusTransactionUser(this.container[i]._id, {
          status: e.target.value,
        })
        .subscribe(
          (data) => {
            this.getPurchaseTransaction();
            e.target.value = "";
            this.loading = false;
          },
          (error) => {
            this.getPurchaseTransaction();
            e.target.value = "";
            this.loading = false;
            // console.log(error);
          }
        );
    }
  }

  // status = ['Confirm', 'Pending', 'Cancel' ];

  popup(i) {
    let item = this.container[i];
    console.log("ITEM--------", i, item);

    if (item.type == "btc") {
      this.btcDetails(item);
    }
    if (item.type == "gold") {
      this.goldDetails(item);
    }
    if (item.type == "wire") {
      this.wireDetails(item);
    }
    if (item.type == "cash") {
      this.cashDetails(item);
    }
  }

  // printDiv() {
  //   window.alert("Hello");
  //   // var divToPrint = document.getElementById('print-index-invoice');
  //   // var newWin = window.open('', 'Print-Window');
  //   // newWin.document.open();
  //   // newWin.document.write('<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
  //   // newWin.document.close();
  //   // setTimeout(function() {
  //   //   newWin.close();
  //   // }, 1000);
  // }

  btcDetails(item) {
    let date = item.createdAt.split("T")[0];
    // var img = baseUrl + "/" + item.picture[0];
    var some = "";
    var img = "";
    if (!item.picture[0]) {
      some = `<h3 style="color:darkgrey"> No Receipt Attached </h3>`;
    }
    else if (item.picture[0].match(/.pdf$/i)) {
      some = `<embed src=${baseUrl +
        "/" +
        item.picture[0].replaceAll(" ", "%20") +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="300px" />`;
    }
    else {
      some = `<img src=${baseUrl +
        "/" +
        item.picture[0] +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="400px" />`;
    }
    some +=
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;">
    <div><b>BTC Amount:</b>` +
      item.amount +
      "</div><br><div><b>Payment Mode:</b>" +
      item.type +
      "</div><br><div><b>Account Number:</b>" +
      item.receiverAccount +
      "</div><br><div><b>Orogram received from Sender:</b>" +
      item.coins +
      `<img src="../../assets/images/orogram_logo.jpeg" width="25px" height="25px" />` +
      "</div><br><div><b>Date:</b>" +
      item.createdAt.split("T")[0] +
      "</div><br><div><b>Invoice Number:</b>" +
      item.transactionId +
      "</div><br><div><b>Status:</b>" +
      item.status.toUpperCase() +
      "</div></div>";
    swal({
      title: "<strong> Transaction Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      text: "Payment Receipt",
      imageUrl: img,
      // imageAlt: 'Payment Receipt Not added yet.',
      showCloseButton: true,
      focusConfirm: false,
      showCancelButton: true,
      // position:'top',
      confirmButtonText: "Print",
      cancelButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: "sweetalert-lg",
      // showCloseButton: true,
      // showCancelButton: true,
      // focusConfirm: false,
      // // position:'top',
      // confirmButtonText:
      //   'Print',
      // cancelButtonText:
      //   '<i class="fa fa-thumbs-up"></i> Ok',
      // customClass: 'sweetalert-lg',
    }).then((result) => {
      console.log("result: ", result, "result in btc: ", result.value);
      if (result.value) {
        this.printDiv();
      }
    });
  }

  goldDetails(item) {
    let date = item.createdAt.split("T")[0];
    // var img = baseUrl + "/" + item.picture[0];
    var some = "";
    var img = "";
    var some =
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;"><div><b>Weight:</b>` +
      item.goldDetails.weight +
      "</div><br><div><b>carat:</b>" +
      item.goldDetails.carat +
      "</div><br><div><b>Name:</b>" +
      item.goldDetails.name +
      "</div><br><div><b>Contact Number:</b>" +
      item.goldDetails.contactNumber +
      "</div><br><div><b>Payment Mode:</b>" +
      item.type +
      "</div><br><div><b>Address:</b>" +
      item.goldDetails.departureAddress +
      "</div><br><div><b>Orogram received from Sender:</b>" +
      item.coins +
      `<img src="../../assets/images/orogram_logo.jpeg" width="25px" height="25px" />` +
      "</div><br><div><b>Date:</b>" +
      item.createdAt.split("T")[0] +
      "</div><br><div><b>Invoice Number:</b>" +
      item.transactionId +
      "</div><br><div><b>Status:</b>" +
      item.status.toUpperCase() +
      "</div></div>";
    swal({
      title: "<strong> Transaction Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      text: "Payment Receipt",
      imageUrl: img,
      // imageAlt: 'Payment Receipt Not added yet.',
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      showCancelButton: true,
      confirmButtonText: "Print",
      cancelButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: "sweetalert-lg",
    });
  }

  wireDetails(item) {
    let date = item.createdAt.split("T")[0];
    var img = baseUrl + "/" + item.picture[0];
    var some = "";
    var img = "";
    if (!item.picture[0]) {
      some = `<h3 style="color:darkgrey"> No Receipt Attached </h3>`;
    }
    else if (item.picture[0].match(/.pdf$/i)) {
      some = `<embed src=${baseUrl +
        "/" +
        item.picture[0].replaceAll(" ", "%20") +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="300px" />`;
    }
    else {
      some = `<img src=${baseUrl +
        "/" +
        item.picture[0] +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="400px" />`;
    }
    some +=
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;"><div><b>Beneficiary Name:</b>` +
      item.bankAccount.beneficiary +
      "</div><br><div><b>Fiat Amount:</b>" +
      item.amount +
      "</div><br><div><b>Currency:</b>" +
      item.bankAccount.currency +
      "</div><br><div><b>Payment Mode:</b>" +
      item.type +
      "</div><br><div><b>Account Number:</b>" +
      item.bankAccount.number +
      "</div><br><div><b>Bank Name:</b>" +
      item.bankAccount.name +
      "</div><br><div><b>Swift Code:</b>" +
      item.bankAccount.swift +
      "</div><br><div><b>Transaction Type:</b>" +
      item.transactionType +
      "</div><br><div><b>Orogram received from Sender:</b>" +
      item.coins +
      `<img src="../../assets/images/orogram_logo.jpeg" width="25px" height="25px" />` +
      "</div><br><div><b>Date:</b>" +
      date +
      "</div><br><div><b>Invoice Number:</b>" +
      item.transactionId +
      "</div><br><div><b>Status:</b>" +
      item.status.toUpperCase() +
      "</div></div>";
    swal({
      title: "<strong> Transaction Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      text: "Payment Receipt",
      imageUrl: img,
      // imageAlt: 'Payment Receipt Not added yet.',
      // position:'top',
      showCancelButton: true,
      confirmButtonText: "Print",
      cancelButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: "sweetalert-lg",
    }).then((result) => {
      if (result.value) {
        this.printDiv();
      }
    });
  }

  // new print functionality added
  printDiv() {
    var divToPrint = document.getElementById("print-index-invoice");
    $("#print-index-invoice").css("margin-top", "-130px");
    document.body.appendChild(divToPrint);
    window.print();
    document.body.removeChild(divToPrint);
  }

  // old functionality of print
  // printDiv() {
  //   var divToPrint = document.getElementById('print-index-invoice');
  //   var newWin = window.open('', 'Print-Window');
  //   newWin.document.open();
  //   newWin.document.write('<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
  //   newWin.document.close();
  //   setTimeout(function() {
  //     newWin.close();
  //   }, 1000);
  // }

  cashDetails(item) {
    let date = item.createdAt.split("T")[0];
    var some = "";
    var img = "";
    if (!item.picture[0]) {
      some = `<h3 style="color:darkgrey"> No Receipt Attached </h3>`;
    }
    else if (item.picture[0].match(/.pdf$/i)) {
      some = `<embed src=${baseUrl +
        "/" +
        item.picture[0].replaceAll(" ", "%20") +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="300px" />`;
    }
    else {
      some = `<img src=${baseUrl +
        "/" +
        item.picture[0] +
        "#toolbar=0&navpanes=0&scrollbar=0"
        } type="application/pdf" width="100%" height="400px" />`;
    }
    some +=
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;"><div><b>Beneficiary Name:</b>` +
      item.cash.name +
      "</div><br><div><b>Fiat Amount:</b>" +
      item.amount +
      "</div><br><div><b>Currency:</b>" +
      item.cash.currency +
      "</div><br><div><b>Payment Mode:</b>" +
      item.type +
      "</div><br><div><b>Address:</b>" +
      item.cash.address +
      "</div><br><div><b>Number:</b>" +
      item.cash.number +
      "</div><br><div><b>Orogram received from Sender:</b>" +
      item.coins +
      `<img src="../../assets/images/orogram_logo.jpeg" width="25px" height="25px" />` +
      "</div><br><div><b>Date:</b>" +
      date +
      "</div><br><div><b>Invoice Number:</b>" +
      item.transactionId +
      "</div><br><div><b>Status:</b>" +
      item.status.toUpperCase() +
      // "</div><br><div><b>Receipt:</b>" +
      // item.picture[0] +
      "</div></div>";
    swal({
      title: "<strong> Transaction Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      text: "Payment Receipt",
      imageUrl: img,
      // imageAlt: 'Payment Receipt Not added yet.',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText: "Print",
      cancelButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
      customClass: "sweetalert-lg",
    }).then((result) => {
      if (result.value) {
        this.printDiv();
      }
    });
  }

  search() {
    if (this.description.length > 3) {
      // this.filterPayload['']
      this.userService
        .getPurchaseTransactionAdmin(
          this.perPage,
          this.currentPage,
          this.filterPayload
        )
        .subscribe(
          (data) => {
            // console.log(data);
            this.container = data["transactions"];
          },
          (error) => {
            // console.log(error);
          }
        );
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

  key: string = "name"; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  setActive() {
    let li = document.getElementsByClassName("navlist1");
    // console.log(this.currentPage, "current pagwe");
    console.log(li, "lisssss");
    for (let i = 0; i < this.pageNumbers.length; i++) {
      // console.log(i ,"working for");

      if (i == this.currentPage) {
        li[i].classList.add("active");
      } else {
        li[i].classList.remove("active");
      }
    }
  }

  pageChange(value?: any) {
    // this.setActive();

    if (value) {
      // console.log("CLIK on page number");

      this.currentPage = value ? value : this.currentPage++;
    } else if (this.currentPage + 1 <= this.pageNumbers.length) {
      // console.log("CLICK on next");

      this.currentPage++;
    }
    this.userService
      .getPurchaseTransactionAdmin(
        this.perPage,
        this.currentPage,
        this.filterPayload,
        this.status
      )
      .subscribe((res) => {
        this.generatePageNumbers(this.count);
        this.container = res["transactions"];
      });
  }

  generatePageNumbers(value: any) {
    let limit = Math.ceil(value / this.perPage);
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
    }
  }

  perPageChange() {
    this.userService
      .getPurchaseTransactionAdmin(
        this.perPage,
        1,
        this.filterPayload,
        this.status
      )
      .subscribe((res) => {
        this.generatePageNumbers(this.count);
        this.currentPage = 1;
        this.container = res["transactions"];
        // console.log(this.container);

        // this.setActive();
      });
  }

  close() {
    this.coins = "";
    this.filesUpName = [];
    // this.walletAddress = '';
    this.display = false;
  }

  ngOnDestroy() {
    localStorage.removeItem("purchaseNotify");
    this.sharedService.updateNotification({ type: "PURCHASE", value: 0 });
  }
}
