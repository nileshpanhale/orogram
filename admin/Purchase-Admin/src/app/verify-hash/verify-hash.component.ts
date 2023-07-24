import { Component, OnInit } from "@angular/core";
import { Angular2Csv } from "angular2-csv";
import { UserService } from "../../Services/user.service";
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import baseUrl from "../../../BaseUrl";
declare var jsPDF: any;
import swal from "sweetalert2";
import "jspdf-autotable";
declare var $: any;
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-verify-hash",
  templateUrl: "./verify-hash.component.html",
  styleUrls: ["./verify-hash.component.css"],
})
export class VerifyHashComponent implements OnInit {
  public remarks: any;
  public perPage: number = 5;
  p: number = 1;
  public form: FormGroup;
  public formTrade: FormGroup;
  public formAdmin: FormGroup;
  public address: AbstractControl;
  public noOfcoins: AbstractControl;
  public addressTrade: AbstractControl;
  public addressAdmin: AbstractControl;
  public container: any;
  public walletAddress: any;
  public description: any;
  public selectedContract: any;
  public selectedTrade: any;
  public selectedAdminTrade: any;
  public result: any;
  public baseurlip = baseUrl;
  public bitoroPrice: any;

  submitted = false;
  errors = "";
  adminBalance: number;

  pageNumbers = [1];
  currentPage = 1;
  status: string;

  constructor(
    public userService: UserService,
    fb: FormBuilder,
    public sanitized: DomSanitizer
  ) {
    // For Contract Details
    this.form = fb.group({
      noOfcoins: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),
        ]),
      ],
      address: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      remarks: [""],
    });

    this.noOfcoins = this.form.controls["noOfcoins"];
    this.address = this.form.controls["address"];
    this.remarks = this.form.controls["remarks"];

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

    this.userService.getGoldPrice().subscribe((data: any) => {
      this.bitoroPrice = data.goldprice;
    },
      error => {
        console.log(error);
      }
    )

    // this.getAdminTx();
    // this.userService.getAccountDetails().subscribe(
    //   (data:any) => {
    //     this.walletAddress = data.account.address;
    //     // console.log(data,"user profile");
    //     // console.log(this.walletAddress);
    //     let balance = data.account.balance;
    //     // console.log(this.intToDecimal(balance),'No. of Coins');
    //     this.adminBalance = parseFloat(this.intToDecimal(balance));
    //     // console.log('Admin Balance',this.adminBalance);
    //   },
    //   error => {
    //     // console.log(error);
    //   }
    // )
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

  // getAdminTx(){
  //   this.userService.getAdminTx().subscribe(
  //     (data:any) => {
  //       // console.log("data",data.transactions);
  //       this.container = data.transactions;
  //       this.generatePageNumbers( data['count']  );
  //       // this.store = data;
  //     },
  //     error => {
  //       // console.log("error",error);
  //     }
  //   )
  // }

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

    this.userService.getHashDetails(values.address).subscribe(
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

    this.userService.getTradeHashDetails(values.addressTrade).subscribe(
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

    this.userService.getAdminHashDetails(values.addressAdmin).subscribe(
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

  btcDetails(item) {
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

  goldDetails(item) {
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

  wireDetails(item) {
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

  cashDetails(item) {
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

  downloadpdf() {
    var doc = new jsPDF("p", "pt");
    var columns = [
      { title: "Transaction Id", dataKey: "transactionId" },
      { title: "Date", dataKey: "createdAt" },
      { title: "Description", dataKey: "remarks" },
      { title: "Receiver Address", dataKey: "receiverAccount" },
      { title: "No of Coins", dataKey: "coins" },
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
      headers: [
        "Transaction Id",
        "Date",
        "Description",
        "Receiver Address",
        "No of Coins",
      ],
    };

    new Angular2Csv(this.transform(), "Transaction Table", options);
  }

  dateCalculation(miliDate: any, days: any) {
    var d = new Date(miliDate);

    d.setDate(d.getDate() - days);

    // return d.toLocaleString();
    return d.toUTCString();
  }

  transform() {
    let allowedFields = [
      "transactionId",
      "createdAt",
      "remarks",
      "receiverAccount",
      "coins",
    ];
    let temp = {};
    let transformed: any = [];
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach((field) => {
        if (field == "createdAt") {
          temp[field] = transaction[field].split("T")[0];
        } else {
          if (field == "coins") {
            temp[field] = transaction[field]
              ? this.intToDecimal(transaction[field])
              : "-";
          } else {
            temp[field] = transaction[field] ? transaction[field] : "-";
          }
        }
      });
      transformed.push(temp);
    });
    return transformed;
  }

  //sorting
  key: string = "walletaddress"; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
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

  setActive() {
    let li = document.getElementsByClassName("navlist1");
    // console.log(this.currentPage, "current pagwe");
    // console.log(li, "lisssss");
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
      .getAdminTx(this.perPage, this.currentPage, this.status)
      .subscribe((res) => {
        this.generatePageNumbers(res["count"]);
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
      .getAdminTx(this.perPage, 1, this.status)
      .subscribe((res) => {
        this.generatePageNumbers(res["count"]);
        this.currentPage = 1;
        this.container = res["transactions"];
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
