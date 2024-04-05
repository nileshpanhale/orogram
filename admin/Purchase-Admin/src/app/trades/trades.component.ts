import { Component, OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv';
import { UserService } from '../../Services/user.service';
import countries from './countries';
import swal from 'sweetalert2';
declare var $: any;
declare var jsPDF: any;
import { Socket } from 'ng-socket-io';
import baseUrl from '../../../BaseUrl';


import 'jspdf-autotable';
import { SharedService } from 'Services/shared.services';
import { Subscription, Observable } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.css']
})
export class TradesComponent implements OnInit {

  public description: any;
  public perPage: number = 50;
  p: number = 1;
  public container: any;
  public tokenError: any
  showprint: boolean = false;
  pageNumbers = [1];
  currentPage = 1;
  status: string;
  txnStatus: string = "";
  public chatRoom: any = [];
  public chatRoomAllData: any = [];//for storing whole object returned from query
  public userMessages: any = [];//saving only messages here
  public roomName: any = null;
  public transactionId: any;
  public chatObject: any;
  public userId1: any;
  public userId2: any;
  public userIdCurrent: any;
  collection: any = countries;
  country: any;
  public baseurlip = baseUrl;
  public selectedTrade: any;
  public chatroomTransactions: any;
  public count: any = '';
  public filterPayload = {};
  public loading = false;
  amount = '';
  wallet = ''
  socketSubscription: Subscription;
  public bitoroPrice:any;                  // Price of 1 BITORO in EURO
  public btcPrice: any;
  public bitorobtc: any;


  constructor(public userService: UserService, private socket: Socket, public sharedService: SharedService,public sanitized: DomSanitizer) {}

  ngOnInit() {

    if (localStorage.getItem('tradeNotify')) {
      localStorage.removeItem('tradeNotify');
      this.sharedService.updateNotification({ type: 'TRADE_ORDER', value: 0 })
    }

    this.socket.on('connection', function(data){
      let value = 0;
      
      if(data.type == 'TRADE_ORDER'){
        
        if(localStorage.getItem('tradeNotify')){
          value = parseInt(localStorage.getItem('tradeNotify'));
        }
        ++value;
        
        this.sharedService.updateNotification({ type : 'SELL', value : value })

        localStorage.setItem('tradeNotify', JSON.stringify(value));
      }
     });

    this.getTradeTx();

    

    // Getting all chatroom transactions -------------------------------------------------
    this.socket.emit('getAllChatData', {});

    this.socket.on('getAllChatData', (msg: any) => {

      this.chatroomTransactions = msg;


      console.log("All Chatroom Data ", msg)

    })

    //socket chat code starts here --------------------------------------------------------


    this.socketSubscription = this.getUserSocket().subscribe((msg: any) => {

      // console.log("Message",msg[0].transactionId);
      // console.log("Message",JSON.stringify(msg));

      //close opened chat when there is no data ---------------
      if (this.chatObject && (this.chatObject._id == msg.transactionId)) {
        if (msg.chatRoomData.length === 0) {

          this.chatRoom = [];
          //setting message when click on self created chat trans----
          let msgObject = {
            roomNo: "No Chat availavle ",
            self: false
          }
          this.chatRoom.push(msgObject);


        } else {

          if (this.chatRoom.length) {
            this.chatRoom = this.chatRoom.filter((ele: any) => !msg.chatRoomData.find((msgEle: any) => { return msgEle.roomName == ele.roomNo }));
            // this.chatRoom.forEach((chatEle:any) => {
            //   let chatIndex = this.chatRoom.findIndex((ele:any) => { return ele.roomNo == chatEle.roomName });
            //   if(chatIndex != -1){
            //     this.chatRoom.splice(chatIndex, 1);
            //   }
            // })
          }
          if (this.chatRoomAllData.length) {
            this.chatRoomAllData = this.chatRoomAllData.filter((ele: any) => !msg.chatRoomData.find((msgEle: any) => { return msgEle.roomName == ele.roomName }));
            // this.chatRoomAllData.forEach((chatEle:any) => {
            //   let chatRoomIndex = this.chatRoomAllData.findIndex((ele:any) => { return ele.roomName == chatEle.roomName });
            //   if(chatRoomIndex != -1){
            //     this.chatRoomAllData.splice(chatRoomIndex, 1);
            //   }
            // });
          }
          msg.chatRoomData.forEach(
            (data: any) => {


              let countUnread = 0;
              // let cnt = Object.keys(data.messages).length;
              // console.log("Message Count : ",cnt)

              //counting read / unread messages ------------------------------------------
              data.messages.forEach(
                (data: any) => {

                  //if current user is message creator, do not increase the counter -------------

                  if (data.MessageFrom === "Admin") {

                  } else if (data.adminread) {

                  } else {
                    countUnread++;

                  }
                })

              //condition added to Hide / Show Bell icon -----------------------
              if (countUnread != 0) {



                this.container.forEach(
                  (containerData: any) => {

                    console.log("Container Tran ID ", containerData._id)

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
          if (msg.chatRoomData.length) {
            msg.chatRoomData.forEach((ele: any) => { this.chatRoomAllData.push(ele) });
          }

        }
      }
      else {
        this.container.find((ele: any) => { return ele._id == msg.transactionId }).tempNotification = true;
        this.container.find((ele: any) => { return ele._id == msg.transactionId }).isNotification = true;
      }

    });





    // this.socketSubscription = this.getUserSocket().subscribe((msg: any) => {

    //   // console.log("Message", msg[0].transactionId);
    //   console.log("Message", msg);

    //   //close opened chat when there is no data ---------------
    //   if (msg.chatRoomData.length === 0) {

    //     this.chatRoom = [];
    //     //setting message when click on self created chat trans----
    //     let msgObject = {
    //       roomNo: "No Chat availavle ",
    //       self: false
    //     }
    //     this.chatRoom.push(msgObject);


    //   } else {

    //     this.chatRoomAllData = [];
    //     this.chatRoom = [];

    //     msg.chatRoomData.forEach(
    //       (data: any) => {

    //         let countUnread = 0;
    //         // let cnt = Object.keys(data.messages).length;
    //         // console.log("Message Count : ",cnt)

    //         //counting read / unread messages ------------------------------------------
    //         data.messages.forEach(
    //           (data: any) => {

    //             //if current user is message creator, do not increase the counter -------------

    //             if (data.MessageFrom === "Admin") {

    //             } else if (data.adminread) {

    //             } else {
    //               countUnread++;

    //             }
    //           })

    //         //condition added to Hide / Show Bell icon -----------------------
    //         if (countUnread != 0) {



    //           this.container.forEach(
    //             (containerData: any) => {

    //               console.log("Container Tran ID ", containerData._id)
    //               console.log("Message Tran ID ", msg[0].transactionId)

    //               if (containerData._id === msg[0].transactionId) {

    //                 containerData['isNotification'] = true;
    //               } else {
    //                 containerData['isNotification'] = false;
    //               }
    //             }
    //           )
    //         }

    //         let msgObject = {
    //           roomNo: data.roomName,
    //           count: countUnread,
    //           self: false
    //         }
    //         this.chatRoom.push(msgObject);
    //       }
    //     )
    //     this.chatRoomAllData = msg;

    //   }

    // });

    
    this.userService.getGoldPrice().subscribe((data: any) => {
      console.log("Data from API: " , data);
      this.bitoroPrice = data.goldprice;
      this.btcPrice = data.btcprice;
      this.bitorobtc = data.bitorobtc;

    },
      error => {
        console.log(error);
      }
    );

    //geting current user profile data ------------------------------
    this.userService.getUserProfile().subscribe(
      (data: any) => {
        //this.userService = data;
        //console.log("user data in sell",data);
        // if(data.firstName || data.lastName){
        //   this.name = data.firstName + ' ' + data.lastName;
        // }
        //this.emailCurrent = data.email;
        this.userIdCurrent = data._id;
        console.log('_Id:', this.userIdCurrent);

        // this.mobile = data.mobile;
      },
      error => {
        // console.log(error);13
      }
    )




  }

  getUserSocket(): Observable<any> {
    return new Observable(_Observer => {

      this.socket.on('messageAdmin', _Message => {
        console.log(_Message);
        _Observer.next(_Message)
      })
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $(".popup-outer span,.chat-header span").click(function () {
        $(this).parent().fadeOut("fast");
        $(".popup-outer a.chat-control i").toggleClass("fa-angle-down")
        // $(this).parents(".popup-outer").fadeOut();
        // $(this).parents(".chatbox-container").fadeOut("fast");
      });
      // if($(".popup-outer").style("display","none")){
      //   $(".chat-container").style("right",15);
      // }
      $(".popup-outer a.chat-control").click(function () {
        $(".popup-wrapper").slideToggle("slow");
        $(".popup-outer a.chat-control i").toggleClass("fa-angle-up").toggleClass("fa-angle-down")
      });
      $(".popup-wrapper ul li a").click(function () {
        $(".chatbox-container").fadeIn("fast");
      });
    })
  }




  getTradeTx(perPage?, currentPage?, status?) {
    this.userService.getTradeTx(perPage, currentPage, this.filterPayload, status).subscribe(
      data => {

        this.container = data['transactions'];
        this.container.forEach(
          (data: any) => {

            data["tempNotification"] = true;

            data['isNotification'] = false;
          }
        )

        console.log("Whole API Data: ", this.container);
        // if((!this.count) && (data['count'])){
        this.count = data['count'];
        this.perPage = this.count

        // }
        this.generatePageNumbers(this.count);


        // comparing notification count from chat and current transaction tranID
        //code for notification Bell ---------------
        for (let i = 0; i < this.container.length; i++) {

          let countUnread = 0;

          for (let j = 0; j < this.chatroomTransactions.length; j++) {

            if (this.container[i]._id == this.chatroomTransactions[j].transactionId) {


              //counting read / unread messages ------------------------------------------
              this.chatroomTransactions[j].messages.forEach(
                (data: any) => {

                  //if current user is message creator, do not increase the counter -------------

                  if (data.MessageFrom === "Admin") {

                  } else if (data.adminread) {

                  } else {

                    console.log("CountreadUpdated", countUnread);

                    this.container[i]['isNotification'] = true;
                    countUnread++;


                  }
                })
              console.log("Transaction Matched", countUnread);
              // //condition added to Hide / Show Bell icon -----------------------
              // if(countUnread != 0){

              // this.container[i]['isNotification']=true;}

              // else{
              //   this.container[i]['isNotification']=false;

              // }

            }

          }

        }

        this.generatePageNumbers(this.count);
        // this.currentPage = 1;
        this.container = data['transactions'];
        console.log("PageChange", this.container);



      },
      error => {
        // console.log(error);
      }
    )
  }
  // data = [
  //   {
  //     date : "19-Mar-2017",
  //     sender : "Dummy Text",
  //     receipent : "Purchase",
  //     tradetype:"sell",
  //     tradeprice : "1200",
  //     paymode : "Wiretransfer",
  //     status  : "Confirm",
  //   },   
  //   {
  //     date : "19-Mar-2017",
  //     sender : "abcdeg",
  //     receipent : "rich",
  //     tradetype:"sell",
  //     tradeprice : "1500",
  //     paymode : "Wiretransfer",
  //     status  : "Pending",
  //   }
  // ]

  // container=this.data;
  // bucket = [
  //     {
  //      date : "19-Mar-2017",
  //     sender : "Dummy Text",
  //     receipent : "Purchase",
  //     tradetype:"sell",
  //     tradeprice : "1500",
  //     paymode : "Wiretransfer",
  //     status  : "Confirm",
  //     },
  //     {
  //       date : "19-Mar-2017",
  //       sender : "Dummy Text",
  //       receipent : "Purchase",
  //       tradetype:"sell",
  //       tradeprice : "1500",
  //       paymode : "Wiretransfer",
  //       status  : "Over",
  //     }
  // ]
  downloadpdf() {
    var doc = new jsPDF('p', 'pt');
    var columns = [
      { title: "Sender Account", dataKey: "senderAccount" },
      { title: "Receiver Account", dataKey: "receiverAccount" },
      { title: "Date", dataKey: "createdAt" },
      { title: "Amount", dataKey: "amount" },
      { title: "Coins", dataKey: "coins" },
    ];
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
      headers: ['Sender Account', 'Receiver Account', 'Date', 'Amount', 'Coins']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }



  transform() {
    let allowedFields = ['senderAccount', 'receiverAccount', 'createdAt', 'amount', 'coins',]
    let temp = {};
    let transformed: any = []
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach(field => {
        if (field == 'createdAt') {
          temp[field] = new Date(transaction[field]).toLocaleDateString();
        } else {
          if (field == 'coins') {
            temp[field] = transaction[field] ? this.intToDecimal(transaction[field]) : '-';
          }
          else {
            temp[field] = transaction[field] ? transaction[field] : '-';
          }
        }
      });
      transformed.push(temp)
    });
    return transformed;
  }

  intToDecimal(input: any) {
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


  changed() {
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

  open() {
    // console.log(this.perPage);
  }

  show() {
    // console.log("In show");
  }

  //sorting
  key: string = 'date'; //set default
  reverse: boolean = true;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  changeStatus(index) {
    if (this.txnStatus) {
      this.loading=true;
      let payload = {
        'status': this.txnStatus.toLowerCase()
      }
      this.userService.changeTradeStatus(this.container[index]._id, payload).subscribe(
        (data: any) => {
          console.log("success")
          this.showSuccess(data.message)
          this.getTradeTx();
          this.txnStatus = "";
      this.loading=false;

        },
        error => {
      this.loading=false;

          this.txnStatus = "";
          console.log("error", error.message);
          this.showError(error.error.message);
        }
      )
    }
  }


  changeState(index) {
    //  console.log('in sates');

    // console.log(this.container[index]._id)
    let payload = {
      'status': 'confirm'
    }
    // console.log('in state',payload);

    this.userService.changeTradeStatus(this.container[index]._id, payload).subscribe(
      (data: any) => {
        this.showSuccess(data.message)
        this.getTradeTx();
        this.txnStatus = "";
      },
      error => {
        this.txnStatus = "";
        // console.log(error.error.message);
        this.showError(error.error.message);
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
  public showDetails(trade: any) {
    console.log('SelectedTrade: ', trade);
    this.selectedTrade = trade;
  }

  
   // new print functionality added
  //  printDiv(){   
  //   var divToPrint = document.getElementById('print-index-invoice');
  //   console.log("Div to print: " , document.getElementById('print-index-invoice').childNodes[0])
  //   // $("#print-index-invoice").css("margin-top", "-130px");
  //   document.body.appendChild(divToPrint);
  //   window.print();
  //   document.body.removeChild(divToPrint);
  //   }
    
    
// //This is code for print page
  printDiv() {
    var divToPrint = document.getElementById('print-index-invoice');
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function() {
      newWin.close();
    }, 1000);
  }
  

  setActive() {
    let li = document.getElementsByClassName('navlist1');
    // console.log(this.currentPage, "current pagwe");
    console.log(li, "lisssss");
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


    this.getTradeTx(this.perPage, this.currentPage, this.status);

    // this.userService.getTradeTx(this.perPage, this.currentPage, this.status).subscribe( res => {

    //   this.generatePageNumbers( res['count']  );
    //   this.container = res['transactions'];
    // });
  }

  generatePageNumbers(value: any) {
    let limit = Math.ceil((value / this.perPage));
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for (let i = 1; i <= limit; i++) {
      this.pageNumbers.push(i);
    }
  }


  perPageChange() {
    this.currentPage = 1
    this.getTradeTx(this.perPage, this.currentPage, this.status);
    // this.userService.getTradeTx(this.perPage,1, this.status).subscribe( res => {
    //   this.generatePageNumbers( res['count']  );
    //   this.currentPage = 1;
    //   this.container = res['transactions'];
    //   console.log("PageChange",this.container);

    // this.setActive();
    // });
  }

  //chat integration from here ---------------------------------------------

  public chatBoolean: boolean = false;


  chat(index: any) {

    // if (this.chatObject) {
    //   this.chatObject.tempNotification = true;
    // }

    this.chatObject = index;
    this.chatRoom = [];
    this.chatRoomAllData = [];

    //clearing privious messages ------------
    //this.messages = []

    this.chatObject.tempNotification = false;

    console.log(index);
    this.transactionId = index._id;


    console.log("TranID ", index._id);
    this.chatBooleanmultiple = false;
    this.messages = [];

    this.socket.emit('getChatroomsAdmin', {

      "transactionId": index._id

    });

    //opning chat rooms ----------------------------------
    $(".popup-wrapper").fadeIn("fast");
    $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down");



  }

  // Chat reply function ---------------------------------------------------------------------
  reply() {


    this.messages.push({
      "text": this.replyMessage,
      "name": "Admin",
      "self": true
    })


    //Getting roomname OR creating newone to match -----------------------------

    let roomnme;

    roomnme = this.roomName;
    console.log("RoomName Rply", roomnme)


    this.socket.emit('message', {

      "roomName": roomnme,
      "orderType": "buy",
      "transactionId": this.transactionId,
      "user1": this.userId1,
      "user2": this.userId2,
      "admin": this.userIdCurrent,
      "messages": [{
        "Message": this.replyMessage,
        "MessageFromEmail": "Admin",
        "MessageFrom": "Admin",
        "isread": false,
        "isself": false,
      }]
    });


    this.replyMessage = "";

  }


  // chat(index: any) {

  //   if (this.chatObject) {
  //     this.chatObject.tempNotification = true;
  //   }

  //   this.chatObject = index;

  //   //clearing privious messages ------------
  //   //this.messages = []

  //   this.chatObject.tempNotification = false;

  //   console.log(index);
  //   this.transactionId = index._id;


  //   console.log("TranID ", index._id);

  //   this.socket.emit('getChatroomsAdmin', {

  //     "transactionId": index._id,
  //     "user1": index.receiver,
  //     "user2": index.sender

  //   });

  //   //opning chat rooms ----------------------------------
  //   $(".popup-wrapper").fadeIn("fast");
  //   $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down");



  // }

  // // Chat reply function ---------------------------------------------------------------------
  // reply() {

  //   this.messages.push({
  //     "text": this.replyMessage,
  //     "name": "Admin",
  //     "self": true
  //   })


  //   //Getting roomname OR creating newone to match -----------------------------

  //   let roomnme;

  //   roomnme = this.roomName;
  //   // console.log("RoomName Rply", roomnme)


  //   this.socket.emit('message', {

  //     "roomName": "NAVNEET",
  //     "orderType": "buy",
  //     "transactionId": this.transactionId,
  //     "user1": this.userId1,
  //     "user2": this.userId2,
  //     "admin": this.userIdCurrent,
  //     "messages": [{
  //       "Message": this.replyMessage,
  //       "MessageFromEmail": "Admin",
  //       "MessageFrom": "Admin",
  //       "isread": false,
  //       "isself": false,
  //     }]
  //   });


  //   this.replyMessage = "";

  // }

  messages = [{
    "text": "",
    "name": "",
    "self": false
  }]
  replyMessage = "";

  public chatBooleanmultiple: boolean = false;





  chatnew(user, index: any) {

    console.log("Getting Index in NEW ", index);
    this.chatBooleanmultiple = true;
    $(".chatbox-container").fadeIn("fast");


    console.log("Data to Update: ", this.chatRoomAllData[index])

    // updating read status here -------------------------------------------------
    this.socket.emit('updateReadStatusAdmin', {

      "transactionId": this.chatRoomAllData[index].transactionId,
      "user1": this.chatRoomAllData[index].user1,
      "user2": this.chatRoomAllData[index].user2


    });

    try {

      //saving current object information--------------------------------
      this.userId2 = this.chatRoomAllData[index].user2;
      this.userId1 = this.chatRoomAllData[index].user1;
      this.roomName = this.chatRoomAllData[index].roomName;
      this.transactionId = this.chatRoomAllData[index].transactionId;

      this.userMessages = this.chatRoomAllData[index].messages;

      this.messages = [];
      let flag = false;


      this.userMessages.forEach(
        (data: any) => {

          if (data.MessageFrom === "Admin") {
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

      user.count = 0


    } catch (e) {

      console.log("No messages available");

      return 0;
    }
  }








  // chatnew(index: any) {

  //   console.log("Getting Index in NEW ", index);
  //   this.chatBooleanmultiple = true;
  //   $(".chatbox-container").fadeIn("fast");


  //   // console.log("Data to Update: ", this.chatRoomAllData[index])


  //   // updating read status here -------------------------------------------------
  //   this.socket.emit('updateReadStatusAdmin', {

  //     "transactionId": this.chatRoomAllData.transactionId,
  //     "user1": this.chatRoomAllData.user1,
  //     "user2": this.chatRoomAllData.user2


  //   });

  //   try {

  //     //saving current object information--------------------------------
  //     this.userId2 = this.chatRoomAllData.user2;
  //     this.userId1 = this.chatRoomAllData.user1;
  //     this.roomName = this.chatRoomAllData.chatRoomData[index].roomName;
  //     this.transactionId = this.chatRoomAllData.transactionId;

  //     this.userMessages = this.chatRoomAllData.chatRoomData[index].messages;

  //     this.messages = [];
  //     let flag = false;


  //     this.userMessages.forEach(
  //       (data: any) => {

  //         if (data.MessageFrom === "Admin") {
  //           flag = true;

  //         } else {

  //           flag = false;
  //         }

  //         let msgObject = {
  //           text: data.Message,
  //           name: data.MessageFromEmail,
  //           self: flag
  //         }
  //         this.messages.push(msgObject);
  //       }
  //     )


  //   } catch (e) {

  //     console.log("No messages available");

  //     return 0;
  //   }showDetails
  // }

  closeChat() {
    this.chatBooleanmultiple = false;
    this.messages = [];
    this.chatRoom = [];
  }

  closeRooms() {
    this.chatObject = '';
    this.chatBooleanmultiple = false;
  }

  countryChanged(country: any) {
    this.filterPayload['country'] = country;
  }

  amountEntered(amount: any) {
    if (parseInt(amount)) {
      this.filterPayload['amount'] = this.isCorrectValue(amount, true, 8);
    } else {
      if (this.filterPayload['amount']) {
        delete this.filterPayload['amount'];
      }
    }
  }

  searchWallet(wallet: any) {
    this.filterPayload['wallet'] = wallet
    // this.filterPayload['receiverWallet'] = wallet
  }

  applyFilter() {
    this.currentPage = 1;
    this.getTradeTx();  
  }

  resetFilter() {
    if (this.filterPayload['amount']) {
      delete this.filterPayload['amount'];
    }
    if (this.filterPayload['country']) {
      delete this.filterPayload['country'];
    }
    this.amount = '';
    this.currentPage = 1;
    this.country = '';
    this.getTradeTx();
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
    if (localStorage.getItem('tradeNotify')) {
      localStorage.removeItem('tradeNotify');
      this.sharedService.updateNotification({ type: 'TRADE_ORDER', value: 0 })
    }
    this.socketSubscription.unsubscribe();

  }

}