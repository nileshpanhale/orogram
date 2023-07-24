import { Component, OnInit } from "@angular/core";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { UserService } from "../../Services/user.service";
import { Router } from "@angular/router";
import baseUrl from "../../../BaseUrl";
import { SearchPipe } from "app/searchFilter.pipe";
import "jspdf-autotable";
import swal from "sweetalert2";
declare var jsPDF: any;
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  public selectedValue: any = "";
  public selectedName: any = "";
  p: number = 1;
  public description: any;
  public perPage: number = 100;
  public container: any;
  public baseurlip = baseUrl;
  public action = "";
  count: any = "";
  pageNumbers = [1];
  currentPage = 1;
  status: string;
  walletAddress: any;
  coinCount: any;
  holdedCoinS: any;
  totalCoin: any;
  holdedCoin: any;
  remainingCoins: any;
  newContainer: any;
  tid: any;
  sender: any;
  receiver: any;
  priceInBit: any;
  timeStamp: any;
  newHtml: any;
  newTable: any;

  constructor(
    public userService: UserService,
    public router: Router,
    public searchFilter: SearchPipe
  ) { }

  ngOnInit() {
    this.getuserDetails();
  }

  getuserDetails() {
    this.userService.getuserDetails(this.perPage).subscribe(
      (data) => {
        console.log("11111", data);
        this.container = data["transformedUsers"];
        // this.count = data['transformedUsers'].length
        // console.log("11111", this.count);
        // data['count'] = this.count
        if (!this.count && data["count"]) {
          this.count = data["count"];
        }
        this.generatePageNumbers(data["count"]);
        console.log("2222222", this.count);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  getAccountDetails1(id) {
    this.userService.getAccountDetails1(id).subscribe(
      (data: any) => {
        
        // this.isLoading = false;
        this.walletAddress = data.address;
        this.totalCoin = data.bal.totalCoins;
        // console.log("this is total coin" , this.totalCoin);
        this.holdedCoin = data.bal.holdedCoins;
        this.remainingCoins = data.bal.calculatedCoins;
        console.log(
          "Received data on wallet page 1 dgnscav: ",
          this.walletAddress
        );
        // console.log("Converted holded coins : ", this.holdedCoinS);
        // console.log("Account balance : ", this.actualbalance);
        // console.log("Total balance : ", this.coinCount);

        // this.totalCoin = this.coinCount;
        // this.remainingCoins = this.actualbalance;
        // this.holdedCoin = this.holdedCoinS.toFixed(8);
        // this.holdedCoin = this.holdedCoinS;
        this.newHtml = `<div class="topModel" id="print-index-invoice">
        <div class="row">
        <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 div1">
          <h2 class="divhd1" style="background: #f4bb09">Wallet</h2>
    
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center">
              <label>Wallet Address</label>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              <label>Total No. Of Orogram Coins</label>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              <label>Admin Holded Coins</label>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              <label>Remaining Coins</label>
            </div>
          </div>
          <div class="row" >
            <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center">
              ${this.walletAddress}
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              ${(this.totalCoin).toFixed(2)}
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              ${(this.holdedCoin).toFixed(2)}
            </div>
            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 text-center">
              ${(this.remainingCoins).toFixed(2)}
            </div>
          </div>
        </div>          
        </div>
        </div>

        <div class="col-12" class="topModel" id="print-index-invoice2">
        <h3  class="heading1">User Wallet History</h3>
        <div>`;
        this.getAdminTx2(id);
      },
      (error: any) => {
        // console.log(error);
      }
    );
  }

  getAdminTx2(id) {
    this.userService
      .getAdminTx2(id, this.perPage, this.currentPage, this.status)
      .subscribe(
        (data: any) => {
          console.log("User Transactions : ", data.data);
          this.newContainer = data.data;
          if (
            this.newContainer == undefined ||
            this.newContainer == "" ||
            this.newContainer == "null"
          ) {
            console.log("is these conditon");
            this.newHtml += `<div id="print-index-invoice" >No data</div>`;
          }
          console.log("Length: ", this.newContainer.length);
          // this.priceInBit = this.newContainer.coins;
          // this.priceInBit = this.newContainer.coins;

          // console.log("Price bit coin data :",this.priceInBit);
          // this.tid = this.newContainer._id;
          // this.sender = this.newContainer.senderWallet;
          // this.receiver = this.newContainer.receiverWallet;
          // let time = this.newContainer.updatedAt;
          // this.timeStamp = this.intoDateFormat(time);

          if (!this.count && data["count"]) {
            this.count = data["count"];
          }
          if (this.newContainer.length) {
            this.newTable = "";
            this.newContainer.sort((x: any, y: any) => {
              return Date.parse(y.updatedAt) - Date.parse(x.updatedAt);
            });
            this.newContainer.forEach((res: any) => {
              this.newTable += `<tr >
            <td style="overflow-wrap: break-word;">${res._id}</td>
            <td style="overflow-wrap: break-word;">${res.senderWallet}</td>
            <td style="overflow-wrap: break-word;">${res.receiverWallet}</td>
            <td style="overflow-wrap: break-word;">${res.coins}</td>
            <td style="overflow-wrap: break-word;">${this.intoDateFormat(
                res.updatedAt
              )}</td>
          </tr>`;
            });
            this.newHtml += `
          <div class="topModel" id="print-index-invoice">
          <div class="row" id="print-index-invoice" >
              <div class="col-md-12 col-lg-12 col-sm-12 col-xs-12 table-responsive">
                <table id="myTable" style="table-layout: fixed;" class="table table-bordered">
                  <thead class="text-center">
                    <tr class="header text-center">
                      <th>Transaction ID
                        <span class="glyphicon sort-icon"
                          [ngClass]="{'glyphicon-chevron-up':reverse,'glyphicon-chevron-down':!reverse}"></span>
                      </th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th width=150px>Price in Orogram
                        <span class="glyphicon sort-icon"
                          [ngClass]="{'glyphicon-chevron-up':reverse,'glyphicon-chevron-down':!reverse}"></span>
                      </th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody id="print-index-invoice2" >
                   ${this.newTable}
                  </tbody>
                </table>
            </div>
            <div>
            </div>
          `;
          }
          this.generatePageNumbers(this.count);
        },
        (error) => {
          // console.log("error",error);
        }
      );
  }

  change(i) {
    // console.log(this.container[i]._id)
    var toSend: boolean;
    if (this.action == "Active") {
      toSend = true;
    } else {
      toSend = false;
    }
    let payload = {
      isActive: toSend,
    };
    this.userService
      .changeUserActivity(this.container[i]._id, payload)
      .subscribe(
        (data) => {
          this.getuserDetails();
          this.action = "";
          // console.log('SUccessful');
        },
        (error) => {
          this.getuserDetails();
          this.action = "";
          // console.log(error);
        }
      );
  }

  popup(i: any) {
    let item = this.searchFilter.transform(
      this.container,
      "userDetails",
      this.description
    )[i];
    console.log(
      "DATA-----",
      i,
      this.container,
      this.container[i],
      this.container[i].bankAccounts.length
    );

    if (item.bankAccounts.length > 0) {
      var some =
        `<div class="topModel" style="text-align: left !important;"><div><b>Beneficiary:</b>` +
        item.bankAccounts[0].beneficiary +
        "</div><br><div><b>Bank:</b>" +
        item.bankAccounts[0].bankName +
        "</div><br><div><b>Account Number:</b>" +
        item.bankAccounts[0].accountNumber +
        "</div><br><div><b>Swift Code:</b>" +
        item.bankAccounts[0].swiftCode +
        "</div><br><div><b>Country of Bank:</b>" +
        item.bankAccounts[0].country +
        "</div><br><div><b>City:</b>" +
        item.bankAccounts[0].city +
        "</div></div>";
    } else {
      var some =
        `<div class="topModel" style="text-align: left !important;"><div><b>Note:</b>` +
        "No Account details Available" +
        "</div></div>";
    }
    swal({
      title: "<strong> Account Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText: "Ok",
      customClass: "sweetalert-lg",
    });
  }

  popDocs(i: any) {
    let item = this.searchFilter.transform(
      this.container,
      "userDetails",
      this.description
    )[i]; //this.container[i];
    // console.log(this.container[i].documents.length);
    // console.log(this.container[i].documents[0])

    if (item.documents.length > 0) {
      var some = " ";
      // var some = `<div class="topModel" style="text-align: left !important;"><div><b>Beneficiary:</b>`+item.bankAccounts[0].beneficiary+"</div><br><div><b>Bank:</b>"+item.bankAccounts[0].bankName+"</div><br><div><b>Account Number:</b>"+item.bankAccounts[0].accountNumber+"</div><br><div><b>Swift Code:</b>"+item.bankAccounts[0].swiftCode+"</div><br><div><b>Country of Bank:</b>"+item.bankAccounts[0].country+"</div><br><div><b>City:</b>"+item.bankAccounts[0].city+"</div></div>"
      for (var j = 0; j < item.documents.length; j++) {
        some +=
          `<div class="topModel" style="text-align: center !important;"><div><b>Documents: </b> <a target="_blank" href=` +
          this.baseurlip +
          "/assets/images/" +
          item.documents[j] +
          `> Download </a><br>`;
        //some +=  `<div class="topModel" style="text-align: center !important;"><div><b>Documents: </b> <a href = "baseurlip+'/assets/images/'+item.documents[j]" target="_blank"> Download</a><br>`
      }
    } else {
      var some =
        `<div class="topModel" style="text-align: left !important;"><div><b>Note:</b>` +
        "No Documents Added by the user." +
        "</div></div>";
    }
    swal({
      title: "<strong> Account Details </strong>",
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText: "Ok",
      customClass: "sweetalert-lg",
    });
  }

  walletPop(i) {
    let item = this.searchFilter.transform(
      this.container,
      "userDetails",
      this.description
    )[i];
    console.log("Wallet Pop up data values of item", item);
    this.getAccountDetails1(item._id);

    setTimeout(() => {
      swal({
        title: "<div><strong> Wallet Details </strong> </div>",
        html: this.newHtml,
        width: 1200,
        padding: 0,
        showCloseButton: true,
        focusConfirm: false,
        showCancelButton: true,
        // showCloseButton: true,
        // focusConfirm: false,
        // position:'top',
        // confirmButtonText:
        //   'Ok',
        confirmButtonText: "Print",
        cancelButtonText: '<i class="fa fa-thumbs-up"></i> Ok',
        customClass: "sweetalert-lg",
      }).then((result) => {
        console.log("result: ", result, "result in btc: ", result.value);
        if (result.value) {
          this.printDiv();
        }
      });
    }, 700);
  }

  // printDiv(){
  //   var divToPrint = document.getElementById('print-index-invoice');
  //   $('#print-index-invoice').css("margin-top", "-130px");
  //   document.body.appendChild(divToPrint);
  //   window.print();
  //   document.body.removeChild(divToPrint);
  // }

  // Added print functionality "Account Balance"
  printDiv() {
    var divToPrint = document.getElementById(
      "print-index-invoice"
    ).parentElement;
    // document.getElementById("print-index-invoice2").style.width="100px";
    // document.getElementById('print-index-invoice').style.marginTop="130px";
    var newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write(`<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/>
      <body onload="window.print()">
      <div><strong> Wallet Details </strong> </div>
       ${divToPrint.innerHTML} </body></html>`);
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 1000);
  }

  search() {
    console.log(
      "111111",
      this.searchFilter.transform(
        this.container,
        "userDetails",
        this.description
      )
    );
    // if(this.description.length>3){
    //   this.dataService.search().subscribe(
    //     data => {
    //       this.container = data;
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   )
    // }
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

  // status = ['Active', 'Deactive']

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
      .getuserDetails(this.perPage, this.currentPage, this.status)
      .subscribe((res) => {
        this.generatePageNumbers(this.count);
        this.container = res["transformedUsers"];
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
      .getuserDetails(this.perPage, 1, this.status)
      .subscribe((res) => {
        this.generatePageNumbers(this.count);
        this.currentPage = 1;
        this.container = res["transformedUsers"];
        // console.log(this.container);
        // this.setActive();
      });
  }

  downloadpdf() {
    var doc = new jsPDF("p", "pt");
    var columns = [
      { title: "Unique Id", dataKey: "userId" },
      { title: "Bitcoin Wallet Address", dataKey: "walletAddress" },
      { title: "Date", dataKey: "createdAt" },
      { title: "Role", dataKey: "role" },
      { title: "Email Id", dataKey: "email" },
      { title: "Phone Number", dataKey: "phone" },
    ];
    doc.autoTable(columns, this.transform());
    doc.save("User Details.pdf");
  }

  public downloadcsv() {
    var options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      headers: [
        "User Id",
        "Bitcoin Wallet Address",
        "Date",
        "Role",
        "Email",
        "Phone",
      ],
    };

    new Angular2Csv(this.transform(), "Transaction Table", options);
  }

  transform() {
    let allowedFields = [
      "image",
      "userId",
      "walletAddress",
      "createdAt",
      "role",
      "email",
      "phone",
    ];
    let temp = {};
    let transformed: any = [];
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach((field) => {
        if (field == "createdAt") {
          temp[field] = transaction[field].split("T")[0];
        } else {
          if (field == "role") {
            temp[field] = transaction[field].toUpperCase();
          } else {
            if (field == "walletAddress") {
              temp[field] = transaction.account.address;
            } else {
              temp[field] = transaction[field] ? transaction[field] : "-";
            }
          }
        }
      });
      transformed.push(temp);
    });
    return transformed;
  }

  intoDateFormat(input: any) {
    console.log("recevied timestamp : ", input);
    let ts = new Date(input);
    console.log("Date converted : ", ts.toUTCString());
    return ts.toUTCString();
  }
}
