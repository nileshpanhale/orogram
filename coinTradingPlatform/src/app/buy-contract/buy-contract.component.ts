import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DataService } from '../../services/data.service'
import { UserService } from '../../services/user.service';
import { SearchPipe } from '../searchPipe';
import { DatePipe } from './datePipe';
declare var jsPDF: any;
declare var $: any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
import countries from './countries';
import currency from './currency';
import { Socket } from 'ng-socket-io';
import baseUrl from '../../../BaseUrl';
import adminid from '../../../../AdminIdChat';
import { FileUploader } from 'ng2-file-upload';
import { finalize } from 'rxjs/operators';
import { SharedService } from 'services/shared.service';
import { DomSanitizer } from "@angular/platform-browser";

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-buy-contract',
  templateUrl: './buy-contract.component.html',
  styleUrls: ['./buy-contract.component.scss'],
  providers: [SearchPipe, DatePipe]
})
export class BuyContractComponent implements OnInit {

  public selectedValue: any = "";
  public selectedName: any = "";
  public description: any;
  public amount: any;
  public codes: any = '';
  p: number = 1;
  public perPage: number = 5000;
  public country: any = '';
  public index = 1;
  public chosenContainer: any;
  public display = false;
  public pay_method = '';
  public pay_bank = '';
  public walletAddress = '';
  public receiverWalletAddress: string = '';
  public accountAddresses: any
  public accountAddress: any;
  public accountCalculatedCoin: any;
  public bitorobtc: any                        // Price of 1 BITORO in BTC
  public btcPrice: any                         // Price of 1 Btc in Euro
  collection = countries;
  currencies = currency;
  public transactionMethod: string = '';
  public totalCoin: any;
  public bitoroPrice: any                      // Price of 1 BITORO in USD
  public coinCount: any;
  public accountCoin: any;
  public filterArray: any = [];
  public tokenError = '';


  public container: any;
  public userAddress: any;

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

  pageNumbers = [1];
  currentPage = 1;
  status: string;

  public isContract: boolean = true;
  public isClosedContract: boolean = false;

  public isBell = false;
  public notiFlag = false;

  public tempTranId: string;
  public tempUser1: string;
  public tempUser2: string;
  public selectedContract: any;
  public remark: any;
  public baseurlip = baseUrl;

  public ethPublic: any;
  public ethPrivate: any;
  public accepterName: any;
  public accepterAddress: any;
  public accepterContact: any;
  public accepterDesc: any;

  public chatroomTransactions: any = [];
  public chatObject: any;

  public filesUpName: Array<string> = [];

  public imageArr: any;
  public localUrl: any = [];

  public uploader: any;
  public cnt = 0;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  public URL = baseUrl + '/transactionscontract/profileImageUploadMultiple';
  public formValue: any;
  public count: number = 0;
  public filterPayload = { isContract: true };
  public clickLink: any;
  loading = false;
  descriptionValue = ''
  tempContainer: any;
  notifications: any

  constructor(public router: Router, public dataService: DataService, private socket: Socket, public userService: UserService, public sharedService: SharedService, public sanitized: DomSanitizer) {

    // image upload code ----------------------------
    this.uploader = new FileUploader({ url: this.URL, itemAlias: 'files' });

    this.uploader.onBeforeUploadItem = (item: any) => {
      item.withCredentials = false;
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.cnt++;

      this.filesUpName.push(JSON.parse(response)[0].path);

      if (this.uploader.queue.length == this.cnt) {
        // sending other data to server -----------------------
        this.trade();
      }
    };


    this.sharedService.notification.subscribe((res: any) => {
      if (res.type == 'CREATE_CONTRACT') {
        setTimeout(() => {
          this.notifications = JSON.parse(localStorage.getItem('notifications'));
        }, 2000);
      }
    })




  }

  ngOnInit() {

    if (localStorage.getItem('notifications')) {
      this.notifications = JSON.parse(localStorage.getItem('notifications'));
      let user: any = this.userService.user;
      this.sharedService.updateNotification({ type: 'CREATE_CONTRACT', userId: user.userId, value: -(parseInt(this.notifications['openContractBuy'])), tradeType: 'SELL' });

    }

    this.getWalletAddress();

    this.chosenContainer = {
      seller: "",
      method: "",
      price: "",
      coins: ""
    }


    // Getting all chatroom transactions -------------------------------------------------
    this.socket.emit('getAllChatData', {});

    this.socket.on('getAllChatData', (msg: any) => {

      this.chatroomTransactions = msg;

      this.getBuyTransaction();

    })

    this.dataService.getGoldPrice().subscribe((data: any) => {
      this.bitoroPrice = data.goldprice;
      // this.btcPrice = data.btcprice;
      // this.bitorobtc = data.bitorobtc;

    },
      error => {
        console.log(error);
      }
    )

    this.dataService.getUserProfile().subscribe(
      (data: any) => {
        console.log(data);
        this.accountAddresses = data.bankAccounts;


        //new code added --------------------------------------
        this.userService.user = data;
        console.log("user data in sell", data);
        // if(data.firstName || data.lastName){
        //   this.name = data.firstName + ' ' + data.lastName;
        // }
        this.emailCurrent = data.email;
        this.userIdCurrent = data._id;
        this.userIdCurrentMaster = data._id;

        this.ethPrivate = data.ethPrivateKey;
        this.ethPublic = data.ethPublicKey;
        this.walletAddress = data.account.address;

      },
      error => {
        // console.log(error);
      }
    )

    // console.log("In Buy");

    this.dataService.getAccountDetails().subscribe(
      (data: any) => {
        this.coinCount = this.intToDecimal(data.bal.totalCoins)
        this.totalCoin = parseFloat(data.bal.totalCoins);

        // this.totalCoin = parseFloat(this.coinCount);

        this.accountAddress = data.address;
        this.getDetails()
      },
      (error: any) => {
        // console.log(error);
      }
    );

    this.dataService.getGoldPrice().subscribe(
      (data: any) => {
        //   console.log("APIGold:: ",data);

        //Converting ounce to gram = data.Mid/28.3495
        // this.bitoroPrice =  Math.round((parseInt(data.Mid)/28.3495) * 100) / 100;
        this.bitoroPrice = data.goldprice;
        this.btcPrice = data.btcprice;
        this.bitorobtc = data.bitorobtc;

      },
      error => {
        console.log(error);
      }
    )




    //socket chat code starts here -----------------------------------------------------------------------


    this.socket.on('message', (msg: any) => {

      //making admin notification data null --------
      this.tempTranId = null;
      this.tempUser1 = null;
      this.tempUser2 = null;

      let convertToArray = [];
      // if((msg != null) || (msg.roomName != this.roomName)){
      //   this.chatRoomAllData = [];
      // }

      try {
        //chatting for 1st time -------------------------------
        if (msg === null) {
          this.chatRoom = [];
          this.chatBooleanmultiple = true;
          $(".chatbox-container").fadeIn("fast");
          this.roomName = null;

          //setting message when click on self created chat trans----
          let msgObject = {
            roomNo: "No Chat availavle ",
            self: false
          }
          this.chatRoom.push(msgObject);

        } else {

          if ((this.userIdCurrentMaster == msg.user1) || (this.userIdCurrentMaster == msg.user2)) {
            console.log('Message: ', msg);
            convertToArray[0] = msg;
            console.log('MessageArr: ', convertToArray);
          }

          if (this.chatRoom.find((ele: any) => {
            return ele.roomNo == "No Chat availavle ";
          })) {
            this.chatRoom = [];
            this.chatRoomAllData = [];
          }

          convertToArray.forEach(
            (data: any) => {


              let countUnread = 0;

              //counting read / unread messages ------------------------------------------
              if (data.user2 == this.userIdCurrentMaster) {
                console.log("Notification Recieved");
                data.messages.forEach(
                  (msg: any) => {



                    //if current user is message creator, do not increase the counter -------------

                    if (msg.MessageFrom === this.userIdCurrentMaster) {

                    } else if (msg.isread) {

                    } else {
                      countUnread++;

                    }

                  }
                )
              }
              //condition added to Hide / Show Bell icon -----------------------
              if (countUnread != 0) {

                this.container.forEach(
                  (containerData: any) => {
                    if (containerData._id === msg.transactionId) {

                      containerData['isNotification'] = true;
                    } else {
                      containerData['isNotification'] = false;
                    }
                  }
                )

              }

              if (this.chatRoom.find((ele: any) => {
                return ele.roomNo == msg.roomName;
              })) {
                let index = this.chatRoom.findIndex((ele: any) => {
                  return ele.roomNo == msg.roomName;
                });
                this.chatRoom.splice(index, 1);
              }
              let msgObject = {
                roomNo: data.roomName,
                count: countUnread,
                self: false
              }
              this.chatRoom.push(msgObject);
            }
          )

          this.roomName = convertToArray[0].roomName;

        }
        //converting data to array to reuse functionality which is already implemented -----------------
        if (this.chatRoomAllData.find((ele: any) => {
          return ele.roomName == msg.roomName;
        })) {
          let index = this.chatRoomAllData.findIndex((ele: any) => {
            return ele.roomName == msg.roomName;
          });
          this.chatRoomAllData.splice(index, 1);
        }

        this.chatRoomAllData.push(convertToArray[0]);
      } catch (error) {

        console.log('No Data found: ');

      }
      // }
    });

    //For setting chat view with same user chat with multiple persons ---------------------------------------------------------------------- 
    this.socket.on('ChatRoom', (msg: any) => {

      console.log('commanRoomMessage: ', msg);
      console.log('commanRoomMessage lnt: ', msg.length === 0);

      //close opened chat when there is no data ---------------
      if (msg.length === 0) {

        this.chatRoom = [];
        //setting message when click on self created chat trans----
        let msgObject = {
          roomNo: "No Chat availavle ",
          self: false
        }
        this.chatRoom.push(msgObject);

        this.closeChat();

      } else {

        this.chatRoomAllData = [];
        this.chatRoom = [];

        msg.forEach(
          (data: any) => {


            let countUnread = 0;

            //counting read / unread messages ---------------------------------------------------------
            data.messages.forEach(
              (data: any) => {

                if (data.MessageFrom === this.userIdCurrentMaster) {

                } else if (data.isread) {
                  //incrementing counter only if user is not current and read flag is false --------------  
                } else {
                  countUnread++;
                }

              }
            )

            //condition added to Hide / Show Bell icon -----------------------
            if (countUnread != 0) {

              this.container.forEach(
                (containerData: any) => {
                  if (containerData._id === msg.transactionId) {

                    containerData['isNotification'] = true;
                  } else {
                    containerData['isNotification'] = false;
                  }
                }
              )
            }

            let msgObject = {
              roomNo: data.roomName,
              count: countUnread,
              self: false
            }
            this.chatRoom.push(msgObject);
          }
        )

        this.chatRoomAllData = msg;
      }
    });



  }

  ngAfterViewInit() {
    $(".popup-wrapper span").click(function () {
      $(this).parent().fadeOut("fast");
      $(".popup-outer a.chat-control i").removeClass("fa-angle-down").addClass("fa-angle-up");
      // $(this).parents(".popup-outer").fadeOut();
      // $(this).parents(".chatbox-container").fadeOut("fast");
    });
    // if($(".popup-outer").css("display","none")){
    //   $(".chat-container").css("right",15);
    // }
    // $(".popup-outer a.chat-control").click(function() {
    //   $(".popup-wrapper").slideUp("slow");
    //   $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down")
    // });
    $(".popup-wrapper ul li a").click(function () {
      $(".chatbox-container").fadeIn("fast");
    });
  }

  getWalletAddress() {
    this.dataService.getAccountDetails().subscribe(
      (data: any) => {
        this.receiverWalletAddress = data.address;
      },
      (error: any) => {
        // console.log(error);
      }
    );
  }



  getBuyTransaction() {
    this.loading = false;
    this.dataService.getBuyContractTransaction(this.perPage, this.currentPage, this.filterPayload).pipe((finalize(() => { this.loading = false }))).subscribe(
      data => {
        this.filterArray = data['transactions']
        this.container = data['transactions'];
        this.container.forEach(
          (data: any) => {

            data['tempNotification'] = true;

            data['isNotification'] = false;
          }
        )

        // comparing notification count from chat and current transaction tranID
        //code for notification Bell ---------------
        for (let i = 0; i < this.container.length; i++) {

          let countUnread = 0;

          for (let j = 0; j < this.chatroomTransactions.length; j++) {

            if (this.container[i]._id == this.chatroomTransactions[j].transactionId && this.chatroomTransactions[j].user2 == this.userIdCurrent) {

              //counting read / unread messages ------------------------------------------
              this.chatroomTransactions[j].messages.forEach(
                (data: any) => {

                  //if current user is message creator, do not increase the counter -------------

                  if (data.MessageFrom === this.userIdCurrentMaster) {

                  } else if (data.isread) {

                  } else {

                    countUnread++;


                  }
                })

              //condition added to Hide / Show Bell icon -----------------------
              if (countUnread != 0) {

                this.container[i]['isNotification'] = true;
              }

              else {
                this.container[i]['isNotification'] = false;

              }

            }

          }

        }
        // if((!this.count) && (data['count'])){
        this.count = data['count'];
        // }
        this.generatePageNumbers(this.count);
        // }

      },
      (error: any) => {
        // console.log(error);
      }
    )
  }

  //search description API call here -----------------------------------------------

  public someArray: any = []
  searchDescription(values: any) {

    this.dataService.searchDescription("payload", values).subscribe(
      (data: any) => {
        console.log("Array", this.someArray);
        console.log(data);

        this.container = data;

      },
      (error: any) => {

        this.showError(error.error.message);

      }
    )
  }

  downloadpdf() {
    var doc = new jsPDF('p', 'pt');
    var columns = [
      { title: "Seller", dataKey: "seller" },
      { title: "Payment Method", dataKey: "method" },
      { title: "Total Price", dataKey: "price" },
      { title: "No.of Coins", dataKey: "coins" },
    ];
    doc.autoTable(columns, this.container);
    doc.save('Buy Crypto Table.pdf');
  }

  downloadcsv() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      headers: ['Seller', 'Payment Method', 'Total Price', 'No. Of Coins']
    };

    new Angular2Csv(this.container, 'Transaction Table', options);
  }

  // change(i){
  //   this.userService.changeStatusTransaction(this.container[i].txn_id, this.container[i].status).subscribe(
  //     data => {

  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }


  popup(i: any) {
    let item = this.container[i];
    let cntry = item.country.toUpperCase();
    if (item.tradeType == 'bank') {
      let crncy = item.currency.toUpperCase();
      var some = `<div class="topModel" style="text-align: left !important;"><div><b>Seller:</b>` + item.senderWallet + "</div><br><div><b>Payment Method:</b>" + item.tradeType.toUpperCase() + "</div><br><div><b>Total Price:</b>" + item.amount + "</div><br> <div><b>No. of Coins:</b>" + this.intToDecimal(item.coins) + "</div><br><div><b>Country:</b>" + cntry + "</div><br><div><b>Currency:</b>" + crncy + "</div><br><div><b>Beneficiary Name:</b>" + this.container[i].bankAccount.beneficiary + "</div><br><div><b>Bank:</b>" + this.container[i].bankAccount.name + "</div><br><div><b>Account Number:</b>" + this.container[i].bankAccount.number + "</div><br><div><b>Swift Code:</b>" + this.container[i].bankAccount.swift + "</div><br><div><b>Country of Bank:</b>" + this.container[i].bankAccount.country + "</div><br><div><b>City:</b>" + this.container[i].bankAccount.city + "</div><br><div><b>Contract Expiry Date:</b>" + item.contractDate + "</div></div>"
    } else {
      var some = `<div class="topModel" style="text-align: left !important;"><div><b>Seller:</b>` + item.senderWallet + "</div><br><div><b>Payment Method:</b>" + item.tradeType.toUpperCase() + "</div><br><div><b>Total Price:</b>" + item.amount + "</div><br> <div><b>No. of Coins:</b>" + this.intToDecimal(item.coins) + "</div><br><div><b>Country:</b>" + cntry + "</div><br><div><b>Seller Wallet Address:</b>" + item.senderAccount + "</div><br><div><b>Contract Expiry Date:</b>" + item.contractDate + "</div></div>"
    }
    swal({
      title: '<strong> Contract Details </strong>',
      html: some,
      width: 800,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        'Ok',
      customClass: 'sweetalert-lg',
    })
  }

  search() {
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

  }

  buy(i: any) {
    let item = this.container[i];
    let details = `<div class="topModel" style="text-align: left !important;"><div><b>Price:</b>` + item.price + "</div><br><div><b>Total Coin:</b>" + item.coins + "</div><br><div class='field'>Enter Coin:<input class='input' type='text' placeholder='No. of Coins'><span class='icon is-small is-left'><i class='mdi mdi-key'></i></span></p></div></div>"
    swal({
      title: '<strong> Transaction Details </strong>',
      html: details,
      width: 400,
      padding: 0,
      showCloseButton: true,
      focusConfirm: false,
      position: 'top-end',
      confirmButtonText:
        'Ok',
      customClass: 'sweetalert-lg',
    })
  }

  callAmount() {
    // console.log(this.amount);
    // console.log(this.country);
    // console.log(this.codes);
    // console.log(this.transactionMethod);
    let data = {
      country: this.country,
      currency: this.codes,
      amount: this.amount,
      method: this.transactionMethod,
    }
    this.dataService.filterBuy(data)
  }

  set(i: number) {
    // this.display=true;
    this.imageArr = [];
    this.index = i;
    this.chosenContainer = this.container[this.index];

    // if((parseFloat(this.intToDecimal(this.chosenContainer.coins))+this.accountCalculatedCoin) > this.totalCoin )
    //adding 2% extra on total ----
    // console.log("AddingTwo :  ",parseFloat(this.intToDecimal(this.chosenContainer.coins) + parseFloat(this.intToDecimal((this.chosenContainer.coins *2/100)))));

    // alert(parseFloat(this.intToDecimal(this.chosenContainer.coins) + parseFloat(this.intToDecimal((this.chosenContainer.coins *2/100)))));

    // alert(parseFloat(this.intToDecimal((this.chosenContainer.coins *2/100))) + parseFloat(this.intToDecimal(this.chosenContainer.coins)));

    // alert(parseFloat(this.intToDecimal(this.chosenContainer.coins)));
    // alert(this.totalCoin);



    //alert(parseFloat(this.intToDecimal(this.chosenContainer.coins) + parseFloat(this.intToDecimal((this.chosenContainer.coins *2/100)))) > this.totalCoin);

    console.log(this.chosenContainer.coins, this.totalCoin);
    if (parseFloat(this.intToDecimal((this.chosenContainer.coins * 2 / 100))) + parseFloat(this.intToDecimal(this.chosenContainer.coins)) > this.totalCoin) {
      swal({
        type: 'error',
        text: 'Insufficient Coins',
        timer: 2000
      })
    }
    else {
      $('#myModal').modal('show');
    }
  }

  setMethod() {
    if (this.pay_method == "Bank") {
      this.walletAddress = '';
    }
    else {
      this.pay_bank = '';
    }
  }

  close() {
    this.pay_method = '';
    this.pay_bank = '';
    this.walletAddress = '';
    this.display = false;
  }

  getDetails() {
    console.log('Acount Address:', this.accountAddress);

    this.dataService.getAccountCoinDetail(this.accountAddress).subscribe(
      (data: any) => {
        // console.log("address",this.accountAddress);

        this.accountCoin = this.intToDecimal(data.coinValue);
        this.accountCalculatedCoin = parseFloat(this.accountCoin);
        // this.accountCalculatedCoin = parseFloat(this.intToDecimal(data.coinValue));

      },
      (error: any) => {
        // console.log(error);
      }
    );
  }

  uploadImages() {
    // this.loading = true;
    if (this.uploader.queue.length > 0) {
      this.uploader.uploadAll();
    }
    else {
      this.trade();
    }
  }

  trade() {
    this.loading = true;
    let txn_id = this.chosenContainer._id;
    let payload = {
      receiver: localStorage.getItem('id'),
      receiverAccount: this.walletAddress,
      ethPublic: this.ethPublic,
      ethPrivate: this.ethPrivate,
      receiverWallet: this.receiverWalletAddress,
      nameReciever: this.accepterName,
      addressReciever: this.accepterAddress,
      contactReciever: this.accepterContact,
      remarksReciever: this.accepterDesc,
      pictureReciever: this.filesUpName
    }
    console.log("AcceptData:", payload);
    this.display = false;
    this.dataService.buyCoinsContract(payload, txn_id).subscribe(
      (data: any) => {
        this.close();
        this.accepterName = '';
        this.accepterContact = '';
        this.accepterDesc = '';
        this.accepterAddress = '';
        this.uploader.clearQueue();
        this.showSuccess(data.message);
        this.getBuyTransaction();
        let user: any = this.userService.user;
        this.socket.emit('usernotification', { type: 'CONTRACT_HISTORY', userId: user.userId, historyUserId: this.chosenContainer.creator });
        this.loading = false;
      },
      (error: any) => {
        // console.log(error);

        this.showError(error.error.message);
        this.close();
        this.loading = false;
      }
    )
  }

  showSuccess(data: string) {
    swal({
      type: 'success',
      text: data,
      timer: 2000
    })
  }

  showError(data: string) {
    swal({
      type: 'error',
      text: data,
      timer: 2000
    })
  }

  intToDecimal(input: any) {
    if (!input) {
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
    if (decimal && decimal.length > 0) {
      decimal = '.' + decimal;
    }
    return intPart + '' + decimal;
  }


  isCorrectValue(currency: any, throwError: any, decimalsVal: any) {
    var parts = String(currency).trim().split('.');
    var amount = parts[0];
    var fraction = '';

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

  //Image selection, showing code ----------------------------------------

  showPreviewImage(event: any) {
    console.log('Events', typeof (event.target.files));

    this.imageArr = event.target.files;
    for (let i = 0; i < this.imageArr.length; i++) {

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageArr[i].localUrl = event.target.result;
      }
      reader.readAsDataURL(this.imageArr[i]);
    }
  }

  setActive() {
    let li = document.getElementsByClassName('navlist1');
    // console.log(this.currentPage, "current pagwe");
    // console.log(li, "lisssss");
    for (let i = 0; i < this.pageNumbers.length; i++) {
      // console.log(i ,"working for");

      if (i == this.currentPage) {
        li[i].classList.add('active')
      } else {
        li[i].classList.remove('active');
      }

    }
  }

  pageChange(value?: any) {
    // this.setActive();

    if (value) {
      // console.log("CLIK on page number");

      this.currentPage = value ? value : this.currentPage++;
    } else if ((this.currentPage + 1) <= this.pageNumbers.length) {
      // console.log("CLICK on next");

      this.currentPage++;
    }
    this.loading = false;
    this.dataService.getBuyContractTransaction(this.perPage, this.currentPage, this.filterPayload, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.filterArray = res['transactions'];
      this.container = res['transactions'];
    });
  }

  generatePageNumbers(value: any) {
    //  console.log('In generate numbers');

    let limit = Math.ceil((value / this.perPage));
    // console.log(limit);

    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
      // console.log(i);

    }
  }


  perPageChange() {
    this.loading = false;
    this.dataService.getBuyContractTransaction(this.perPage, 1, this.filterPayload, this.status).pipe((finalize(() => { this.loading = false }))).subscribe(res => {
      this.generatePageNumbers(this.count);
      this.currentPage = 1;
      this.filterArray = res['transactions'];
      this.container = res['transactions'];
      // console.log(this.container);

      // this.setActive();
    });
  }

  // Chat reply function ---------------------------------------------------------------------


  // reply(){


  //   console.log("TranID Rply ",this.transactionId);
  //   console.log("TranCreator Rply ",this.userId);
  //   console.log("UserCurrent Rply: ",this.userIdCurrent);
  //   console.log("UserEqual Rply: ",this.userIdEqual);

  //   const chatBy = this.userIdCurrentMaster;
  //   const chatByEmail = this.emailCurrent
  //   console.log("curerent usere: ",chatBy);
  //   console.log("TempUser  : ",this.tempUser2);
  //   this.messages.push({
  //     "text":this.replyMessage,
  //     "name":chatByEmail,
  //     "self":true
  //   })

  //   if(this.roomName != null){
  //   let index =  this.chatRoomAllData.findIndex( (ele:any)=>{
  //     return ele.roomName == this.roomName
  //   });
  //   this.chatRoomAllData[index].messages.push({
  //     "MessageFrom":chatBy,
  //     "MessageFromEmail":chatByEmail,
  //     "Message":this.replyMessage,
  //     "self":true
  //   });
  //   }
  //   //if transaction created by current user, shifting id to update chat in database--------
  //   // if(this.userId === this.userIdCurrent){

  //   //   this.userIdCurrent = this.userIdEqual;

  //   // }
  //   this.userIdCurrent = this.userIdEqual;
  //   //Getting roomname OR creating newone --------------------------------------------

  //   let roomnme;
  //   console.log("RoomName Rply above",this.roomName)
  //   if(this.roomName == null){

  //   roomnme = "Room" +Math.floor((Math.random() * 100000) + 1);
  //   }else{

  //     roomnme = this.roomName;
  //     console.log("RoomName Rply",roomnme)

  //   }

  //   this.socket.emit('message', {

  //     "roomName": roomnme,
  //     "orderType": "buy",
  //     "transactionId": this.transactionId,
  //     "user1": 	this.userId,
  //     "user2":	this.userIdCurrent,
  //     "admin":	adminid.adminID,
  //     "messages": [{
  //           "Message": this.replyMessage,
  //           "MessageFrom": chatBy,
  //           "MessageFromEmail": chatByEmail,
  //           "isread":false,
  //           "isself":false,
  //           }]
  //     });

  //   this.replyMessage = "";


  // }

  reply() {


    console.log("TranID Rply ", this.transactionId);
    console.log("TranCreator Rply ", this.userId);
    console.log("UserCurrent Rply: ", this.userIdCurrent);
    console.log("UserEqual Rply: ", this.userIdEqual);

    const chatBy = this.userIdCurrentMaster;
    const chatByEmail = this.emailCurrent;

    this.messages.push({
      "text": this.replyMessage,
      "name": chatByEmail,
      "self": true
    })

    //if transaction created by current user, shifting id to update chat in database--------
    if (this.userId === this.userIdCurrent) {

      this.userIdCurrent = this.userIdEqual;

    }

    //Getting roomname OR creating newone --------------------------------------------

    let roomnme;
    console.log("RoomName Rply above", this.roomName)
    if (this.roomName == null) {

      roomnme = "Room" + Math.floor((Math.random() * 100000) + 1);
    } else {

      roomnme = this.roomName;
      console.log("RoomName Rply", roomnme)

    }

    this.socket.emit('message', {

      "roomName": roomnme,
      "orderType": "buy",
      "transactionId": this.transactionId,
      "user1": this.userId,
      "user2": this.userIdCurrent,
      "admin": adminid.adminID,
      "messages": [{
        "Message": this.replyMessage,
        "MessageFrom": chatBy,
        "MessageFromEmail": chatByEmail,
        "isread": false,
        "isself": false,
      }]
    });

    this.replyMessage = "";


  }



  //declered array -----------------
  messages = [{
    "text": "",
    "name": "",
    "self": false
  }]
  replyMessage = "";

  public chatBoolean: boolean = false;


  // Chat button function for respective transaction-------------------------------------------------------------

  chat(index: any, event: any) {
    // console.log(event);


    if (this.chatObject) {
      this.chatObject.tempNotification = true;
    }

    this.chatObject = this.container[index];
    // console.log(event);
    //clearing privious messages ------------
    //console.log("newChatObj:",this.chatObject);

    this.chatObject.tempNotification = false;
    console.log('Condition', this.chatObject.isNotification && this.chatObject.tempNotification);



    //clearing privious messages ------------
    this.messages = []

    console.log(index);

    let item = this.container[index];

    //opning chat rooms ----------------------------------
    $(".popup-wrapper").fadeIn("fast");
    $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down");


    //getting current transaction id and creator of transaction ------------
    this.transactionId = item._id;
    this.userId = item.creator;

    // Checking current user in all available chatrooms ---------0-------------------------
    if (this.userId === this.userIdCurrent) {

      console.log("Tran in equal ");
      this.socket.emit('checkRooms', {

        "transactionId": this.transactionId,
        "user1": this.userIdCurrent

      });

    } else {

      this.socket.emit('getMessage', {

        "transactionId": this.transactionId,
        "user1": this.userId,
        "user2": this.userIdCurrent

      });
      this.chatBoolean = !this.chatBoolean;

    }
  }







  // chat(index: any, event: any) {
  //   console.log(event);

  //   if (this.chatObject[index]) {
  //     this.chatObject[index].tempNotification = true;
  //   }

  //   this.chatObject[index] = this.container[index];
  //   // console.log(event);
  //   //clearing privious messages ------------
  //   console.log("newChatObj:", this.chatObject);

  //   this.chatObject[index].tempNotification = false;
  //   console.log('Condition', this.chatObject[index].isNotification && this.chatObject[index].tempNotification);
  //   //clearing privious messages ------------
  //   this.messages = []

  //   console.log(index);

  //   let item = this.container[index];

  //   //opning chat rooms ----------------------------------
  //   $(".popup-wrapper").fadeIn("fast");
  //   $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down");


  //   //getting current transaction id and creator of transaction ------------
  //   this.transactionId = item._id;
  //   this.userId = item.creator;

  //   // Checking current user in all available chatrooms ----------------------------------
  //   if (this.userId === this.userIdCurrent) {

  //     console.log("Tran in equal ");
  //     this.socket.emit('checkRooms', {

  //       "transactionId": this.transactionId,
  //       "user1": this.userIdCurrent

  //     });

  //   } else {

  //     this.socket.emit('getMessage', {

  //       "transactionId": this.transactionId,
  //       "user1": this.userId,
  //       "user2": this.userIdCurrent

  //     });
  //     this.chatBoolean = !this.chatBoolean;

  //   }

  //   //this.chatnew(index);

  // }


  //comman function for updating chat in 2nd window i.e Actual chat-----------------------------------------------------------
  public chatBooleanmultiple: boolean = false;

  chatnew(index: any) {

    this.chatBooleanmultiple = true;
    $(".chatbox-container").fadeIn("fast");

    //saving current chat data in vars --------
    try {

      this.tempTranId = this.chatRoomAllData[index].transactionId;
      this.tempUser1 = this.chatRoomAllData[index].user1;
      this.tempUser2 = this.chatRoomAllData[index].user2;



      // updating read status here ---------------------------
      this.socket.emit('updateReadStatus', {

        "transactionId": this.chatRoomAllData[index].transactionId,
        "user1": this.chatRoomAllData[index].user1,
        "user2": this.chatRoomAllData[index].user2

      });

      // making count zero ---------

      this.chatRoom[index].count = 0;

    } catch (error) {

    }


    try {

      this.userIdEqual = this.chatRoomAllData[index].user2;
      this.roomName = this.chatRoomAllData[index].roomName;

      this.userMessages = this.chatRoomAllData[index].messages;
      console.log(this.userMessages);

      this.messages = [];
      let flag = false;

      this.userMessages.forEach(
        (data: any) => {

          if (data.MessageFrom === this.userIdCurrentMaster) {
            flag = true;

          } else {

            flag = false;
          }

          let msgObject = {
            text: data.Message,
            name: data.MessageFromEmail,
            self: flag
          }
          this.messages.push(msgObject);
        }
      )


    } catch (e) {

      console.log("No messages available");
      return 0;
    }
  }

  notifyAdminNeeded() {

    // updating read status here ---------------------------
    this.socket.emit('showAdminNotification', {

      "transactionId": this.tempTranId,
      "user1": this.tempUser1,
      "user2": this.tempUser2

    });

    swal({
      type: 'success',
      text: 'Notified to Admin',
      timer: 2000
    })

  }

  closeChat() {
    this.chatBooleanmultiple = false;
    this.messages = [];
  }

  public filterData() {
    let amountToCheck: any = '';
    this.tokenError = '';
    if (this.amount) {
      if (this.amount.match(/^-?\d*(\.\d+)?$/)) {
        amountToCheck = this.isCorrectValue(this.amount, true, 8)
      }
      else {
        this.tokenError = "Enter a valid number";
      }

    }
    if (!this.tokenError) {
      let pipeValue = SearchPipe.prototype.transform(this.filterArray, amountToCheck, this.country, this.transactionMethod);
      this.container = pipeValue;
    }

  }

  public resetValue() {
    this.container = this.filterArray;
    this.country = '';
    this.amount = '';
    this.transactionMethod = '';
    this.tokenError = '';
  }

  public showDetails(contract: any) {
    this.selectedContract = contract;
    console.log("Contract Details : ", this.selectedContract);
  }

  selected: string;

  changeState() {
    if (this.selected.length > 2) {
      this.searchDescription(this.selected)
    }
    if (this.selected.length == 1) {
      this.getBuyTransaction();

    }
  }

  countryChanged(country: any) {
    this.filterPayload['country'] = country;
  }

  amountEntered(amount: any) {
    // this.currentPage = 1;
    if (parseInt(amount)) {
      this.filterPayload['coins'] = this.isCorrectValue(amount, true, 8);
    } else {
      if (this.filterPayload['coins']) {
        delete this.filterPayload['coins'];
      }
    }
    // this.getBuyTransaction()
  }

  applyFilter() {
    this.currentPage = 1;
    this.getBuyTransaction();
  }

  resetFilter() {
    if (this.filterPayload['coins']) {
      delete this.filterPayload['coins'];
    }
    if (this.filterPayload['country']) {
      delete this.filterPayload['country']
    }
    this.amount = '';
    this.currentPage = 1;
    this.country = '';
    this.getBuyTransaction();
  }

  searchDescriptionValue() {
    if (this.descriptionValue) {
      if (!this.tempContainer) {
        this.tempContainer = this.container;
      }
      this.container = this.tempContainer.filter((ele: any) => { return ele.remarks.includes(this.descriptionValue) })
    }
    else {
      this.container = this.tempContainer;
    }
  }

  amountEuro(coin: any) {
    return (this.bitoroPrice * coin).toFixed(2)
  }

  pdfExtmatch(image: any) {
    //  this.imageUrl =  baseUrl + '/' + image.replaceAll(" ", "%20");
    if (image.match(/.pdf$/i)) {
      // console.log(this.imageUrl.match(/.pdf$/i), "hello")
      return false;
    } else {
      // console.log(this.imageUrl.match(/.pdf$/i), "hi")
      return true;
    }
  }


  ngOnDestroy() {
    if (localStorage.getItem('notifications')) {
      let user: any = this.userService.user;
      this.sharedService.updateNotification({ type: 'CREATE_CONTRACT', userId: user.userId, value: -(parseInt(this.notifications['openContractBuy'])), tradeType: 'SELL' });
    }

  }

  getLink(values: any) {

    // Create a regular expression to match URLs
    var urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace the URLs with HTML links
    return (values.replace(urlRegex, "$1"));

  }

}




