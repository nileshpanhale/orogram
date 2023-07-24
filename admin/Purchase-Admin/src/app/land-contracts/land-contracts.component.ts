import { Component, OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv';
import { UserService } from '../../Services/user.service';
import baseUrl from '../../../BaseUrl';


import swal from 'sweetalert2';
declare var $ : any;
declare var jsPDF: any;
import { Socket } from 'ng-socket-io';


import 'jspdf-autotable';
import { SharedService } from 'Services/shared.services';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-land-contracts',
  templateUrl: './land-contracts.component.html',
  styleUrls: ['./land-contracts.component.css']
})
export class LandContractsComponent implements OnInit {

  public description:any;
  public perPage:number=50;
  p: number = 1;
  public container:any;

  pageNumbers = [1];
  currentPage=1;
  status: string;
  txnStatus: string="";
  public chatRoom:any=[];
  public chatRoomAllData:any=[];//for storing whole object returned from query
  public userMessages:any = [];//saving only messages here
  public roomName:any = null;
  public transactionId:any;
  public chatObject:any;
  public userId1:any;
  public userId2:any;
  public userIdCurrent:any;
  public selectedContract:any;
  public bitoroPrice:any;
  public btcPrice:any;
  public bitorobtc: any;                    // Price of 1 BITORO in EURO
  public baseurlip = baseUrl;
  public filterPayload = {};
  public tokenError: any
  public loading = false;

  public chatroomTransactions:any;
  count:any = '';
  wallet = ''
  socketSubscription: Subscription;

  constructor(public userService:UserService, private socket: Socket, public sharedService : SharedService, public sanitized: DomSanitizer) {
      }

  ngOnInit() {

    if(localStorage.getItem('privateContractNotify')){
      localStorage.removeItem('privateContractNotify');
      this.sharedService.updateNotification({ type : 'PRIVATE_CONTRACT', value : 0 })
    }

    this.socket.on('connection', function(data){
      
      let value = 0;
      
      if(data.type == 'PRIVATE_CONTRACT'){
        console.log("Type of data in private: ", data.type)
        
        if(localStorage.getItem('privateContractNotify')){
          value = parseInt(localStorage.getItem('privateContractNotify'));
        }
        ++value;
        
        this.sharedService.updateNotification({ type : 'SELL', value : value })

        localStorage.setItem('privateContractNotify', JSON.stringify(value));
      }
     });

    this.userService.getGoldPrice().subscribe( (data:any) => {
        this.bitoroPrice =  data.goldprice;
        // this.btcPrice = data.btcprice;
        // this.bitorobtc = data.bitorobtc;
          
        },
        error => {
          console.log(error);
        }
    )

    this.getTradeTx();

    

    // Getting all chatroom transactions -------------------------------------------------
  this.socket.emit('getAllChatData', {});

    this.socket.on('getAllChatData', (msg: any) => {

      this.chatroomTransactions = msg;
      // console.log("All Chatroom Data ",msg)

    })
    
    //socket chat code starts here --------------------------------------------------------
   
    this.socketSubscription = this.getUserSocket().subscribe((msg: any) => {

        // console.log("Message",msg[0].transactionId);
        // console.log("Message",msg);

        //close opened chat when there is no data ---------------
        if(msg.length === 0){

          this.chatRoom = [];
        //setting message when click on self created chat trans----
        let msgObject = {
          roomNo:"No Chat availavle ",
          self:false
        }
        this.chatRoom.push(msgObject);


        }else{

          this.chatRoomAllData = [];
          this.chatRoom = [];
     
          msg.forEach(
            (data:any) => {
    
               let countUnread=0;
              // let cnt = Object.keys(data.messages).length;
              // console.log("Message Count : ",cnt)
             
            //counting read / unread messages ------------------------------------------
              data.messages.forEach(
                (data:any) => {
                  
                 //if current user is message creator, do not increase the counter -------------
 
                 if(data.MessageFrom === "Admin"){
                                           
                }else if (data.adminread){
                                  
                }else{
                  countUnread++;
                  
                }
                })

                //condition added to Hide / Show Bell icon -----------------------
                if(countUnread != 0){

                 
                          
                  this.container.forEach(
                    (containerData:any) => {

                      if(containerData._id === msg[0].transactionId){
                        
                        containerData['isNotification']=true;
                      }else{
                        containerData['isNotification']=false;
                      }
                    }
                  )
                }

              let msgObject = {
                roomNo:data.roomName,
                count:countUnread,
                self:false
              }
              this.chatRoom.push(msgObject);
            }
          )
          this.chatRoomAllData = msg;

        }

    });

    this.userService.getGoldPrice().subscribe( (data:any) => {
        this.bitoroPrice =  data.goldprice;
        this.btcPrice = data.btcprice;
        this.bitorobtc = data.bitorobtc;
          
        },
        error => {
          console.log(error);
        }
    )

//geting current user profile data ------------------------------
this.userService.getUserProfile().subscribe(
  (data:any) => {
    //this.userService = data;
    //console.log("user data in sell",data);
    // if(data.firstName || data.lastName){
    //   this.name = data.firstName + ' ' + data.lastName;
    // }
    //this.emailCurrent = data.email;
    this.userIdCurrent = data._id;
    // console.log('_Id:',this.userIdCurrent);
    
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
        _Observer.next(_Message)
      })
    })
  }

  ngAfterViewInit(){
    $(".popup-outer span,.chat-header span").click(function() {
      $(this).parent().fadeOut("fast");
      $(".popup-outer a.chat-control i").toggleClass("fa-angle-down")
      // $(this).parents(".popup-outer").fadeOut();
      // $(this).parents(".chatbox-container").fadeOut("fast");
    });
    // if($(".popup-outer").style("display","none")){
    //   $(".chat-container").style("right",15);
    // }
    $(".popup-outer a.chat-control").click(function() {
      $(".popup-wrapper").slideToggle("slow");
      $(".popup-outer a.chat-control i").toggleClass("fa-angle-up").toggleClass("fa-angle-down")
    });
    $(".popup-wrapper ul li a").click(function(){
      $(".chatbox-container").fadeIn("fast");
    });
  }




  getTradeTx(perPage?, currentPage?, status?){
    this.userService.getLandContractTx(5, currentPage, this.filterPayload, status).subscribe(
      data => {
        
        this.container = data['transactions'];
        this.container.forEach(
          (data:any) => {

            data["tempNotification"] = true;

            data['isNotification']=false;
          }
        )

        console.log("Container Transactions Check : ",this.container );
        if((!this.count) && (data['count'])){
          this.count = data['count'];
          this.perPage = this.count

        }
        this.generatePageNumbers( this.count );

        
      // comparing notification count from chat and current transaction tranID
      //code for notification Bell ---------------
      for(let i=0; i<this.container.length; i++){

        let countUnread=0;

        for(let j=0; j<this.chatroomTransactions.length; j++){

            if(this.container[i]._id == this.chatroomTransactions[j].transactionId)
            {
              

               //counting read / unread messages ------------------------------------------
               this.chatroomTransactions[j].messages.forEach(
                (data:any) => {
                  
                 //if current user is message creator, do not increase the counter -------------
 
                 if(data.MessageFrom === "Admin"){
                                           
                }else if (data.adminread){
                                  
                }else{
                  countUnread++;
                  
                  
                }
                })
                console.log("Transaction Matched",countUnread);
                  //condition added to Hide / Show Bell icon -----------------------
                  if(countUnread != 0){

                  this.container[i]['isNotification']=true;}

                  else{
                    this.container[i]['isNotification']=false;

                  }
                      
              }

            }
       
      }

      this.generatePageNumbers( this.count  );
      // this.currentPage = 1;
      this.container = data['transactions'];
      // console.log("PageChange",this.container);



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
  downloadpdf(){
    var doc = new jsPDF('p', 'pt');
    var columns = [
      {title: "Sender Account", dataKey: "senderAccount"},
      {title: "Receiver Account", dataKey: "receiverAccount"}, 
      {title: "Date", dataKey: "createdAt"},
      {title: "Amount", dataKey: "amount"},
      {title: "Coins", dataKey: "coins"},
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
      headers:['Sender Account','Receiver Account','Date','Amount','Coins']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }

  amountEuro(coin:any) {
    return (this.bitoroPrice *coin).toFixed(2);
  }


  transform() {
    let allowedFields = ['senderAccount','receiverAccount','createdAt','amount','coins',]
    let temp = {};
    let transformed:any = []
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach(field => {
        if(field == 'createdAt'){
          temp[field] = new Date(transaction[field]).toLocaleDateString();
        } else {
          if(field == 'coins'){
            temp[field] = transaction[field]?this.intToDecimal(transaction[field]): '-' ;
          }
          else{
            temp[field] = transaction[field]?transaction[field]: '-' ;
          }
        }
      });
      transformed.push(temp) 
    });
    return transformed;
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


  changed(){
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

  open(){
    // console.log(this.perPage);
  }

  show(){
    // console.log("In show");
  }

   //sorting
   key: string = 'date'; //set default
   reverse: boolean = true;
   sort(key){
     this.key = key;
     this.reverse = !this.reverse;
   }

   changeStatus(index){
    // console.log(this.container[index]._id)
      if(this.txnStatus){
        let payload = {
          'status':this.txnStatus.toLowerCase()
        }
        this.userService.changeContractStatus(this.container[index]._id, payload).subscribe(
          (data:any) => {
            this.showSuccess(data.message)
            this.getTradeTx();
            this.txnStatus="";
          },
          error => {
            this.txnStatus="";
            // console.log(error.error.message);
            this.showError(error.error.message);
          }
        )
      }
   }

   searchWallet(wallet:any) {
    this.filterPayload['wallet'] = wallet
    // this.filterPayload['receiverWallet'] = wallet
  }


   changeState(index){
    //  console.log('in sates');
    this.loading = true;
     
    // console.log(this.container[index]._id)
    let payload = {
      'status':'confirm'
    }
    // console.log('in state',payload);
    
    this.userService.changeContractStatus(this.container[index]._id, payload).subscribe(
      (data:any) => {
        this.showSuccess(data.message)
        this.getTradeTx();
        this.txnStatus="";
      this.loading = false;
      },
      error => {
      this.loading = false;
        this.txnStatus="";
        // console.log(error.error.message);
        this.showError(error.error.message);
      }
    )
   }

   applyFilter() {
    this.currentPage = 1;
    this.getTradeTx();
  }

   showSuccess(data:string){
    swal({
      type: 'success',
      text: data,
      timer:2000
    })
  }

  showError(data:string){
    swal({
      type: 'error',
      text: data,
      timer:2000
    })
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


    this.getTradeTx(this.perPage, this.currentPage, this.status);

    // this.userService.getTradeTx(this.perPage, this.currentPage, this.status).subscribe( res => {
      
    //   this.generatePageNumbers( res['count']  );
    //   this.container = res['transactions'];
    // });
  }

   generatePageNumbers(value:any) {
    let limit = Math.ceil( (value/this.perPage) );
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for(let i=1; i<=limit; i++) {
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

public chatBoolean:boolean=false;

chat(index:any){
  
    if(this.chatObject){
      this.chatObject.tempNotification = true;
    } 

  this.chatObject = index;

  //clearing privious messages ------------
  //this.messages = []

  this.chatObject.tempNotification = false;

  console.log(index);
  this.transactionId = index._id;
  

  console.log("TranID ",index._id);

  this.socket.emit('getChatroomsAdmin', {

    "transactionId":index._id
    
    });

  //opning chat rooms ----------------------------------
  $(".popup-wrapper").fadeIn("fast");
  $(".popup-outer a.chat-control i").removeClass("fa-angle-up").addClass("fa-angle-down");


  
}

// Chat reply function ---------------------------------------------------------------------
reply(){

 
  this.messages.push({
    "text":this.replyMessage,
    "name":"Admin",
    "self":true
  })


  //Getting roomname OR creating newone to match -----------------------------

  let roomnme;
  
    roomnme = this.roomName;
    console.log("RoomName Rply",roomnme)

  
  this.socket.emit('message', {

    "roomName": roomnme,
    "orderType": "buy",
    "transactionId": this.transactionId,
    "user1": 	this.userId1,
    "user2":	this.userId2,
    "admin":	this.userIdCurrent,
    "messages": [{
          "Message": this.replyMessage,
          "MessageFromEmail": "Admin",
          "MessageFrom": "Admin",
          "isread":false,
          "isself":false,
          }]
    });


  this.replyMessage = "";

}

messages = [{
  "text":"",
  "name":"",
  "self":false
}]
replyMessage = "";

public chatBooleanmultiple:boolean=false;


chatnew(index:any){

  console.log("Getting Index in NEW ",index);
  this.chatBooleanmultiple = true;
  $(".chatbox-container").fadeIn("fast");


  console.log("Data to Update: ",this.chatRoomAllData[index])

  
// updating read status here -------------------------------------------------
  this.socket.emit('updateReadStatusAdmin', {

    "transactionId":this.chatRoomAllData[index].transactionId,
    "user1":this.chatRoomAllData[index].user1,
    "user2":this.chatRoomAllData[index].user2
  
  
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
    (data:any) => {

      if(data.MessageFrom === "Admin"){
        flag = true;
        
      }else {
  
        flag = false;
      }

       let msgObject = {
        text:data.Message,
        name:data.MessageFromEmail,
        self:flag
      }
      this.messages.push(msgObject);
    }
  )
  
 
} catch (e) {

  console.log("No messages available");

    return 0;
}
}

closeChat(){
  this.chatBooleanmultiple = false;
  this.messages = [];
}

public showDetails(contract:any){
  console.log('SelectedContract',contract);
  this.selectedContract = contract;
}


//This is code for print page
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


dateCalculation(miliDate:any,days:any){

  var d = new Date(miliDate);

  d.setDate(d.getDate() - days);

  // return d.toLocaleString();
  return d.toUTCString()

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
  if (localStorage.getItem('contractNotify')) {
    localStorage.removeItem('contractNotify');
    this.sharedService.updateNotification({ type: 'CREATE_CONTRACT', value: 0 })
  }
}

}
