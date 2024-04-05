import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "../../services/data.service";
import { UserService } from "../../services/user.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { FormGroup, AbstractControl, FormBuilder, Validators } from "@angular/forms";
import baseUrl from "../../../BaseUrl";
import adminid from "../../../../AdminIdChat";
declare var jsPDF: any;
import "jspdf-autotable";
import swal from "sweetalert2";
import { tick } from "@angular/core/src/render3";
import { Socket } from "ng-socket-io";
import { DomSanitizer } from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: "app-tradeHistory",
  templateUrl: "./verifyhash-open-trade-contract-history.component.html",
  styleUrls: ["./verifyhash-open-trade-contract-history.component.scss"],
})
export class VerifyhashAllComponent implements OnInit {
  public remarks: any;
  public selectedValue: any = "";
  public selectedName: any = "";
  public description: any;
  p: number = 1;
  public perPage: number = 5;
  public container: any;
  public action: any = "";
  public temp: any;
  public tempCount: any;
  public address: AbstractControl;
  public noOfcoins: AbstractControl;
  public addressTrade: AbstractControl;
  public addressAdmin: AbstractControl;
  public selectedContract: any;
  public selectedTrade: any;
  public selectedAdminTrade: any;
  submitted = false;
  errors = "";
  public result: any;
  pageNumbers = [1];
  currentPage = 1;
  status: string;
  public form: FormGroup;
  public formTrade: FormGroup;
  public formAdmin: FormGroup;
  public roomName: any = null;
  public transactionId: any;
  public userId: any;
  public chatRoom: any = [];
  public chatRoomAllData: any = [];
  public userMessages: any = [];
  public userIdCurrent: any;
  public userIdCurrentMaster: any;
  public userIdEqual: any;
  public emailCurrent: any;
  public tempTranId: string;
  public tempUser1: string;
  public tempUser2: string;
  public ethPublic: any;
  public ethPrivate: any;
  public baseurlip = baseUrl;
  public chatroomTransactions: any = [];
  public chatObject: any;

  constructor(
    public dataService: DataService,
    public router: Router,
    public userService: UserService,
    private socket: Socket,
    fb: FormBuilder,
    public sanitized: DomSanitizer
  ) {
    this.form = fb.group({
      address: ["", Validators.compose([Validators.required, Validators.minLength(5)])],
    });

    this.address = this.form.controls["address"];

    // For Trade Details
    this.formTrade = fb.group({
      noOfcoins: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),
        ]),
      ],
      addressTrade: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      remarks: [""],
    });

    this.noOfcoins = this.formTrade.controls["noOfcoins"];
    this.addressTrade = this.formTrade.controls["addressTrade"];
    this.remarks = this.formTrade.controls["remarks"];

    // For Admin Hash Details
    this.formAdmin = fb.group({
      noOfcoins: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),
        ]),
      ],
      addressAdmin: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      remarks: [""],
    });

    this.noOfcoins = this.formAdmin.controls["noOfcoins"];
    this.addressAdmin = this.formAdmin.controls["addressAdmin"];
    this.remarks = this.formAdmin.controls["remarks"];

  }

  ngOnInit() {
    this.getPurchaseTransaction();

    //-----------------------------------------------------------------
  }

  get f() {
    return this.form.controls;
  }
  get f1() {
    return this.formTrade.controls;
  }
  get f2() {
    return this.formAdmin.controls;
  }

  //veryfy hash ----------------------------------------------

  onSubmit(values: any): void {
    this.submitted = true;
    this.result = "";
    console.log("Values are coming: ", values);

    // if(this.form.valid){
    // let payload = {
    //   'coins':this.isCorrectValue(values.noOfcoins, true,8),
    //   'walletAddress':values.address,
    //   'remarks':values.remarks
    //    }
    //  console.log('payload',payload);

    this.dataService.getHashDetails(values.address).subscribe(
      (data: any) => {
        // console.log("selectedContract: " ,data[0].contract)
        // this.showSuccess('Successfully Transferred');
        // this.getAdminTx();
        // this.form.reset();
        // console.log("HashRes",data);
        if (data != null && data.length > 0) {
          $("#exampleModalLong").modal("show");

          data.confirmation = "Confirmed";
          this.selectedContract = data[0].contract;
          this.showDetails(this.selectedContract);
          this.form.reset();
        } else {
          $("#exampleModalLong").modal("hide");
          data.confirmation = "Not Found";
        }
      },
      (error: any) => {
        // console.log(error);
        this.showError(error.error.message);
      }
    );
    // }
  }

  public showDetails(contract: any) {
    console.log("SelectedContract", contract);
    this.selectedContract = contract;
  }

  // new code implementation for getTradeDetail
  onSubmitTradeDetail(values: any): void {
    this.submitted = true;
    this.result = "";

    this.dataService.getTradeHashDetails(values.addressTrade).subscribe(
      (data: any) => {
        if (data != null && data.length > 0) {
          $("#exampleModalLong1").modal("show");
          data.confirmation = "Confirmed";
          this.selectedTrade = data[0].contract;
          this.showTradeDetails(this.selectedTrade);
          // console.log(this.selectedTrade);
          this.formTrade.reset();
        } else {
          $("#exampleModalLong1").modal("hide");
          data.confirmation = "Not Found";
        }
      },
      (error: any) => {
        // console.log(error);
        this.showError(error.error.message);
      }
    );
    // }
  }

  public showTradeDetails(contract: any) {
    console.log("selectedTrade Contract: ", contract);
    this.selectedTrade = contract;
  }

  //  Code for implementation for getAdminTxDetail
  onSubmitAdminDetail(values: any): void {
    this.submitted = true;
    this.result = "";
    console.log("Selected admin values: ", values);

    this.dataService.getAdminHashDetails(values.addressAdmin).subscribe(
      (data: any) => {
        // console.log("HashRes Data of Trade : ",data);
        console.log("selectedAdminTrade Contract: ", data);
        if (data != null && data.length > 0) {
          this.selectedAdminTrade = data[0].contract;
          if (this.selectedAdminTrade.type == "btc") {
            this.btcDetails(this.selectedAdminTrade);
          }
          if (this.selectedAdminTrade.type == "gold") {
            this.goldDetails(this.selectedAdminTrade);
          }
          if (this.selectedAdminTrade.type == "wire") {
            this.wireDetails(this.selectedAdminTrade);
          }
          if (this.selectedAdminTrade.type == "cash") {
            this.cashDetails(this.selectedAdminTrade);
          }
          console.log("showAdminDetails: ", this.selectedAdminTrade);
          this.formAdmin.reset();
        } else {
          data.confirmation = "Not Found";
        }
      },
      (error: any) => {
        // console.log(error);
        this.showError(error.error.message);
      }
    );
    // }
  }

  public showAdminDetails(contract: any) {
    console.log("selected Admin Contract: ", contract);
    this.selectedAdminTrade = contract;
  }

  popup(i: any) {
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


  btcDetails(item: any) {
    // console.log("Ites: " , item);
    let date = item.createdAt.split("T")[0];
    var img = baseUrl + "/" + item.picture[0];
    console.log("ITEM", item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some =
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;">
    <div><b>Amount:</b>` +
      item.amount +
      "</div><br><div><b>Payment Mode:</b>" +
      item.type +
      "</div><br><div><b>Account Number:</b>" +
      item.receiverAccount +
      "</div><br><div><b>Orogram received from Sender:</b>" +
      item.coins +
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
      // imageUrl: img,
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

  goldDetails(item: any) {
    let date = item.createdAt.split("T")[0];
    var img = baseUrl + "/" + item.picture[0];
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
      // imageUrl: img,
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

  wireDetails(item: any) {
    let date = item.createdAt.split("T")[0];
    var img = baseUrl + "/" + item.picture[0];
    // console.log("ITEM",item);
    // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Account Number:</b>`+item.receiverAccount+"</div><br><div><b>Amount:</b>"+item.amount+"</div><br><div><b>Currency:</b>"+item.currency+"</div><br><div><b>Payment Mode:</b>"+item.type+"</div><br><div><b>Transaction Type:</b>"+item.transactionType+"</div><br><div><b>Date:</b>"+date+"</div><br><div><b>Status:</b>"+item.status+"</div></div>"
    var some =
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;"><div><b>Beneficiary Name:</b>` +
      item.bankAccount.beneficiary +
      "</div><br><div><b>Amount:</b>" +
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
      // imageUrl: img,
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

  cashDetails(item: any) {
    let date = item.createdAt.split("T")[0];
    var img = baseUrl + "/" + item.picture[0];
    console.log("ITEM", item);

    var some =
      `<div class="topModel" id="print-index-invoice" style="text-align: left !important;"><div><b>Beneficiary Name:</b>` +
      item.cash.name +
      "</div><br><div><b>Amount:</b>" +
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
      text: "Payment Receipt",
      // imageUrl: img,
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


  getPurchaseTransaction() {
    this.dataService.getTradeContractAllHistory().subscribe(
      (data: any) => {
        console.log(data);

        this.container = data.transactions;
        this.temp = this.container;
        this.tempCount = data["count"];
        this.generatePageNumbers(data["count"]);
      },
      (error: any) => {
        // console.log(error);
      }
    );
  }

  search() {
    if (this.description.length > 3) {
      this.dataService
        .getTradeContractAllHistory(this.perPage, this.currentPage, this.description)
        .subscribe((result: any) => {
          // console.log(result, "result");
          this.generatePageNumbers(result.count);
          this.container = result.transactions;
        });
    } else {
      this.generatePageNumbers(this.tempCount);
      this.container = this.temp;
    }
  }

  showSuccess(data: string) {
    swal({
      type: "success",
      text: data,
      timer: 2000,
    });
  }

  showError(data: string) {
    swal({
      type: "error",
      text: data,
      timer: 2000,
    });
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

  dateCalculation(miliDate: any, days: any) {
    var d = new Date(miliDate);

    d.setDate(d.getDate() - days);

    // return d.toLocaleString();
    return d.toUTCString();
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
    this.dataService.getTradeContractAllHistory(this.perPage, this.currentPage, this.status).subscribe((res) => {
      this.generatePageNumbers(res["count"]);
      this.tempCount = res["count"];
      this.container = res["transactions"];
      this.temp = this.container;
    });
  }

  generatePageNumbers(value: any) {
    //  console.log('In generate numbers');
    let limit = Math.ceil(value / this.perPage);
    // console.log(limit);

    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
      // console.log(i);
    }
  }

  perPageChange() {
    this.dataService.getTradeContractAllHistory(this.perPage, 1, this.status).subscribe((res) => {
      this.generatePageNumbers(res["count"]);
      this.tempCount = res["count"];
      this.currentPage = 1;
      this.container = res["transactions"];
      this.temp = this.container;
      // console.log(this.container);

      // this.setActive();
    });
  }

  pdfExtmatch(image: any) {
    if (image.match(/.pdf$/i)) {
      return false;
    } else {
      return true;
    }
  }

}
