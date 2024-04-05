import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service'
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import baseUrl from '../../../BaseUrl';
import adminid from '../../../../AdminIdChat';
import { FileUploader } from 'ng2-file-upload';
declare var jsPDF: any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
import { tick } from '@angular/core/src/render3';
import { Socket } from 'ng-socket-io';
import { finalize } from 'rxjs/operators';
import { SharedService } from 'services/shared.service';
import { DomSanitizer } from "@angular/platform-browser";

declare var $:any;

@Component({
  selector: 'app-tradeHistory',
  templateUrl: './trade-contract-history-closed.component.html',
  styleUrls: ['./trade-contract-history-closed.component.scss']
})
export class TradeContractHistoryClosedComponent implements OnInit 

  {
    public selectedValue:any="";
    public selectedName:any="";
    public description:any;
    p: number = 1;
    public perPage:number=5
    public container:any;
    public action : any ='';
    public temp:any;
    public tempCount:any
    pageNumbers = [1];
    currentPage=1;
    status: string;

    //iamage upload vars -----
    public imageArr:any;
    public uploader:any;
    public cnt = 0;
    public filesUpName: Array<string> = [];
    public URL = baseUrl+'/transactionscontract/profileImageUploadMultiple';
    public savecontainerid:any;
    public roomName:any = null;
    public transactionId:any;
    public userId:any;
    public chatRoom:any=[];
    public chatRoomAllData:any=[];
    public userMessages:any = [];
    public userIdCurrent:any;
    public userIdCurrentMaster:any;
    public userIdEqual:any;
    public emailCurrent:any;
    public bitoroPrice:any;                  // Price of 1 BITORO in EURO
    public btcPrice: any;
    public bitorobtc: any;
    public tempTranId:string;
    public tempUser1:string;
    public tempUser2:string;
    public ethPublic:any;
    public ethPrivate:any;
    public selectedContract:any;
    public baseurlip = baseUrl;
    public chatroomTransactions:any = [];
    public chatObject:any;
    public count:number= 0;
    public loading = true;
    historyNotifications:any;
  
    constructor( public dataService : DataService, public router:Router, public userService : UserService, private socket: Socket, public sharedService : SharedService , public sanitized: DomSanitizer) {


       // image upload code ----------------------------
    this.uploader  = new FileUploader({url: this.URL , itemAlias: 'files'});

    this.uploader.onBeforeUploadItem = (item:any) => {
        item.withCredentials = false;
    }

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        this.cnt++;

        console.log("responsePaid",JSON.parse(response)[0]);
        this.filesUpName.push(JSON.parse(response)[0].path);
       
        if(this.uploader.queue.length == this.cnt){
            // sending other data to server -----------------------
            let payload = {
              'status':'paid',
              ethPublic:this.ethPublic,
              ethPrivate:this.ethPrivate,
              paidrecipetImages:this.filesUpName
            }
            // console.log('trade-history',payload);
            this.dataService.changeStatusTransactionContract(this.container[this.savecontainerid]._id, payload).subscribe(
              (data:any) => {
                let user:any = this.userService.user;
                this.socket.emit('usernotification', { type: 'PRIVATE_CONTRACT_HISTORY', userId: user.userId, historyUserId: this.container[this.savecontainerid].creator });
                this.showSuccess(data.message)
                this.getPurchaseTransaction();
                this.action="";
                this.savecontainerid = null;
              },
              error => {
                this.action="";
                // console.log(error.error.message);
                this.showError(error.error.message);
              }
            )
        }
    };


     }
  
    ngOnInit() {
      if (localStorage.getItem('historyNotifications')) {
        this.historyNotifications = JSON.parse(localStorage.getItem('historyNotifications'));
        let user:any = this.userService.user;
        this.sharedService.updateNotification({ type: 'PRIVATE_CONTRACT_HISTORY', userId: user.userId, value : -(parseInt(this.historyNotifications['privateContractHistory'])), historyUserId : user._id });
  
      }
      this.getPurchaseTransaction();
     
      // console.log(localStorage.getItem('accessToken'));

       // Getting all chatroom transactions -------------------------------------------------
      this.socket.emit('getAllChatData', {});

      this.socket.on('getAllChatData', (msg: any) => {
  
      this.chatroomTransactions = msg;

  
      // console.log("AllChatroomData ",msg)
  
    })

    this.dataService.getGoldPrice().subscribe((data: any) => {
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
      this.dataService.getUserProfile().subscribe(
        (data:any) => {
          this.userService.user = data;
          console.log("user data in sell",data);
          // if(data.firstName || data.lastName){
          //   this.name = data.firstName + ' ' + data.lastName;
          // }
          this.emailCurrent = data.email;
          this.userIdCurrent = data._id;
          this.userIdCurrentMaster = data._id;

          this.ethPrivate = data.ethPrivateKey;
          this.ethPublic  = data.ethPublicKey;

          console.log('_Id:',this.userIdCurrent);
          
        // this.mobile = data.mobile;
        },
        error => {
          // console.log(error);
        }
      )

      this.dataService.getGoldPrice().subscribe( (data:any) => {
        console.log("APIGold:: ",data);
      this.bitoroPrice =  data.goldprice;
      this.btcPrice = data.btcprice;
      // this.bitorobtc = data.bitorobtc;
        
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
      this.chatRoomAllData = [];
      this.chatRoom = [];

      try {
            console.log('Message: ',msg);
      
            convertToArray[0] = msg;
            console.log('MessageArr: ',convertToArray);

            //chatting for 1st time -------------------------------
            if(msg === null){

              this.chatBooleanmultiple = true;
              $(".chatbox-container").fadeIn("fast");
              this.roomName = null;
            
              //setting message when click on self created chat trans----
              let msgObject = {
                roomNo:"No Chat availavle ",
                self:false
              }
              this.chatRoom.push(msgObject);

            }else{



            convertToArray.forEach(
              (data:any) => {

               
                let countUnread=0;
                         
              //counting read / unread messages ------------------------------------------
                data.messages.forEach(
                  (data:any) => {
                                   

              //if current user is message creator, do not increase the counter -------------
 
                    if(data.MessageFrom === this.userIdCurrentMaster){
                                           
                    }else if (data.isread){
                                      
                    }else{
                      countUnread++;
                      
                    }
                     
                  }
                )
               

                //condition added to Hide / Show Bell icon -----------------------
                if(countUnread != 0){
                          
                  this.container.forEach(
                    (containerData:any) => {
                      if(containerData._id === msg.transactionId){
                        
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

            this.roomName = convertToArray[0].roomName;
            
            }
            //converting data to array to reuse functionality which is already implemented -----------------
            this.chatRoomAllData = convertToArray;

          } catch (error) {

            console.log('No Data found: ');
            
          }

      });


    //For setting chat view with same user chat with multiple persons -----------  
    this.socket.on('ChatRoom', (msg: any) => {
    
      console.log('commanRoomMessage: ',msg);
      console.log('commanRoomMessage lnt: ',msg.length === 0);

      //close opened chat when there is no data ---------------
      if(msg.length === 0){
        
        this.chatRoom = [];
        //setting message when click on self created chat trans----
        let msgObject = {
          roomNo:"No Chat availavle ",
          self:false
        }
        this.chatRoom.push(msgObject);

        this.closeChat();

      }else{

      this.chatRoomAllData = [];
      this.chatRoom = [];
     
      msg.forEach(
        (data:any) => {

         
          let countUnread=0;
          
        //counting read / unread messages ------------------------------------------
          data.messages.forEach(
            (data:any) => {
              
              if(data.MessageFrom === this.userIdCurrentMaster){
                  
              }else if (data.isread){
              //incrementing counter only if user is not current and read flag is false --------------  
              }else{
                countUnread++;
              }
               
            }
          )
    
             //condition added to Hide / Show Bell icon -----------------------
         if(countUnread != 0){
                  
          this.container.forEach(
            (containerData:any) => {
              if(containerData._id === msg.transactionId){
                
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

//-----------------------------------------------------------------
    }

    ngAfterViewInit(){
      $(".popup-wrapper span").click(function() {
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
      $(".popup-wrapper ul li a").click(function(){
        $(".chatbox-container").fadeIn("fast");
      });
    }
  
    getPurchaseTransaction(){
      this.loading = true;
      this.dataService.getTradeContracts().pipe((finalize(() => {this.loading = false}))).subscribe(
        (data:any) => {
          console.log(data);
          let someObject = data.transactions[4];
          console.log('some',someObject);
          
          // console.log(someObject.status==='paid' && someObject.creator == this.userIdCurrent && someObject.transactionType==='buy' );
           
          // console.log('In trade');
          
          this.container = data.transactions;
          this.temp = this.container;
          // this.tempCount = data['count'];
          if((!this.count) && (data['count'])){
            this.count = data['count'];
            this.tempCount = data['count'];
          }
          this.generatePageNumbers( this.count  );  

          this.container.forEach(
            (data:any) => {
  
              data['tempNotification']= true;
  
              data['isNotification']=false;
            }
          )
  
          // comparing notification count from chat and current transaction tranID
        //code for notification Bell ---------------
        for(let i=0; i < this.container.length; i++){
  
          let countUnread=0;
  
          for(let j=0; j < this.chatroomTransactions.length; j++){
  
              if(this.container[i]._id == this.chatroomTransactions[j].transactionId)
              {
                
                 //counting read / unread messages ------------------------------------------
                 this.chatroomTransactions[j].messages.forEach(
                  (data:any) => {
                    
                   //if current user is message creator, do not increase the counter -------------
   
                   if(data.MessageFrom === this.userIdCurrentMaster){
                                             
                    }else if (data.isread){
                                    
                    }else{
  
                    countUnread++;
                    
                    
                  }
                  })
  
                  // console.log("TransactionMatched",countUnread);
                  // console.log("Transaction", this.container[i]);
                    //condition added to Hide / Show Bell icon -----------------------
                    if(countUnread != 0){
  
                    this.container[i]['isNotification'] = true;
                  }
  
                    else{
                      this.container[i]['isNotification'] = false;
  
                    }
                        
                }
  
              }
         
        }
        },
        (error:any) => {
          // console.log(error);
        }
      )
    }
    
    downloadpdf(){
      // console.log("Container",this.container);
      var coinAmount = this.intToDecimal(this.container.coins);
      var doc = new jsPDF('l', 'pt', 'a4');
      var columns = [
        {title:"Unique Id" , dataKey:"_id" },
        {title: "Receiver Wallet", dataKey:"receiverWallet" },
        {title: "Sender Wallet", dataKey:"senderWallet" },
        {title: "Created Time", dataKey: "createdAt"}, 
        {title: "Coin value", dataKey: "amount"},
        {title: "Transaction Date", dataKey: "updatedAt"},
        {title: "Status", dataKey: "status"},
    ];
      doc.autoTable(columns, this.container );
      doc.save('Transaction Table.pdf');
    }
  
    downloadcsv(){
      var options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: true,
        headers:['User','Transaction Date','Date','Address','Type','Payment Method','Transaction Date','Status','Bank Name','Account No.','Payment Mode','Time']
      };
  
      new Angular2Csv(this.container, 'Transaction Table', options);
    }


    //confirm dialoge function here --------------
    confirm_final(){

      this.loading = true;
      $('#confirm').modal('hide');


      let payload = {
            'status':this.action.toLowerCase(),
            ethPublic:this.ethPublic,
            ethPrivate:this.ethPrivate
          }
          // console.log('trade-history',payload);
          this.dataService.changeStatusTransactionContract(this.container[this.savecontainerid]._id, payload).subscribe(
            (data:any) => {
              let user:any = this.userService.user;
              this.socket.emit('usernotification', { type: 'PRIVATE_CONTRACT_HISTORY', userId: user.userId, historyUserId: this.container[this.savecontainerid].creator });
              // $('#confirm').modal('hide');
              this.showSuccess(data.message)
              this.getPurchaseTransaction();
              this.action="";
              this.savecontainerid=null;
              this.loading = false;
            },
            error => {
              this.action="";
              // $('#confirm').modal('hide');
              // console.log(error.error.message);
              this.showError(error.error.message);
              this.loading = false;
            }
          )
  
      }
  
    change(i:any){
      // console.log(this.container[i]._id)
      if(this.action){

        this.savecontainerid = i;

        //uploading new images on sttaus paid ------
        if(this.action.toLowerCase() == "paid"){


          this.imageArr = [];
          console.log("in Paid >>>>>>");
          
          $('#myModalupload').modal('show');


        }else{

       //showing confirm dialog--------
       $('#confirm').modal('show');
       
      }
    }
    }


    dateCalculation(miliDate:any,days:any){

      var d = new Date(miliDate);

      d.setDate(d.getDate() - days);

      // return d.toLocaleString();
      return d.toUTCString()

    }

    uploadImages(){
      if(this.uploader.queue.length > 0){
      this.uploader.uploadAll();}
     
    }
    
    search(){
      if( this.description.length > 3) {
        this.loading = true;
        this.dataService.getTradeContracts(this.perPage, this.currentPage, this.description).pipe((finalize(() => {this.loading = false}))).subscribe( (result:any) => {
          // console.log(result, "result");
          this.generatePageNumbers( result.count  );
          this.container = result.transactions;
        })
      }
      else{
        this.generatePageNumbers( this.tempCount  );
        this.container = this.temp;
      }
      // if(this.description.length>3){
      //   this.dataService.search().subscribe(
      //     (data:any) => {
      //       this.container = data.transactions;
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

    amountEuro(coin:any) {
      return (this.bitoroPrice *coin).toFixed(2);
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
        this.loading = true;
        this.dataService.getTradeContracts(this.perPage, this.currentPage, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
          this.generatePageNumbers( this.count  );
          this.tempCount = res['count'];
          this.container = res['transactions'];
          this.temp = this.container;
        });
      }
    
       generatePageNumbers(value:any) {
        //  console.log('In generate numbers');
        let limit = Math.ceil( (value/this.perPage) );
        // console.log(limit);
        
        this.pageNumbers.splice(0, this.pageNumbers.length);
        for(let i=1; i<=limit; i++) {
        this.pageNumbers.push(i);
        // console.log(i);
        
        }
      }
    
       perPageChange() {
         this.loading = true;
        this.dataService.getTradeContracts(this.perPage,1, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
          this.generatePageNumbers( this.count  );
          this.tempCount = res['count'];
          this.currentPage = 1;
          this.container = res['transactions'];
          this.temp = this.container;
          // console.log(this.container);
          
          // this.setActive();
        });
      }

      showBankDetails(i:any){
        console.log('In showBankDetatil');
        if((this.container[i].transactionType == 'sell' && this.container[i].receiver == null) || (this.container[i].transactionType == 'buy' && this.container[i].sender == null)){
          swal({
            type: 'warning',
            text: 'No User to Trade',
            width:400,
            padding:0,
            showCloseButton: true,
            focusConfirm: false,
            // position:'top',
            customClass: 'sweetalert-lg',
          })
        }
        else{
          if(this.container[i].tradeType == "bank"){
            var some;
            if(this.container[i].creator == localStorage.getItem('id')){
              some = `<div class="topModel" style="text-align: left !important;"><div><b>Bank Name:</b>`+this.container[i].traderAccountDetails.bankName+"</div><br><div><b>Beneficiary:</b>"+this.container[i].traderAccountDetails.beneficiary+"</div><br><div><b>Account Number:</b>"+this.container[i].traderAccountDetails.accountNumber+"</div><br><div><b>Swift Code:</b>"+this.container[i].traderAccountDetails.swiftCode+"</div><br><div><b>Country:</b>"+this.container[i].traderAccountDetails.country+"</div><br><div><b>Currency:</b>"+this.container[i].currency+"</div><br><div><b>City:</b>"+this.container[i].traderAccountDetails.city+"</div></div>"
            }
            else{
              some = `<div class="topModel" style="text-align: left !important;"><div><b>Bank Name:</b>`+this.container[i].bankAccount.name+"</div><br><div><b>Beneficiary:</b>"+this.container[i].bankAccount.beneficiary+"</div><br><div><b>Account Number:</b>"+this.container[i].bankAccount.number+"</div><br><div><b>Swift Code:</b>"+this.container[i].bankAccount.swift+"</div><br><div><b>Country:</b>"+this.container[i].bankAccount.country+"</div><br><div><b>Currency:</b>"+this.container[i].currency+"</div><br><div><b>City:</b>"+this.container[i].bankAccount.city+"</div></div>"
            }
              swal({
                title: '<strong> Account Details </strong>',
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
          else{
            var some;
            if(this.container[i].transactionType == 'sell'){
              some = `<div class="topModel" style="text-align: left !important;"><div><b>Receiver Wallet:</b>`+this.container[i].receiverWallet+"</div><br><div><b>Receiver Account:</b>"+this.container[i].receiverAccount+"</div><br><div><b>Transaction Type:</b>"+this.container[i].transactionType.toUpperCase()+"</div><br><div><b>Trade Type:</b>"+this.container[i].tradeType+"</div></div>"
            }
            else{
              some = `<div class="topModel" style="text-align: left !important;"><div><b>Sender Wallet:</b>`+this.container[i].senderWallet+"</div><br><div><b>Sender Account:</b>"+this.container[i].senderAccount+"</div><br><div><b>Transaction Type:</b>"+this.container[i].transactionType.toUpperCase()+"</div><br><div><b>Trade Type:</b>"+this.container[i].tradeType+"</div></div>"
            }
            swal({
                title: '<strong> Account Details </strong>',
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
      }


      // Chat reply function ---------------------------------------------------------------------
    reply(){

         
      console.log("TranID Rply ",this.transactionId);
      console.log("TranCreator Rply ",this.userId);
      console.log("UserCurrent Rply: ",this.userIdCurrent);
      console.log("UserEqual Rply: ",this.userIdEqual);

      const chatBy = this.userIdCurrentMaster;
      const chatByEmail = this.emailCurrent

      this.messages.push({
        "text":this.replyMessage,
        "name":chatByEmail,
        "self":true
      })

      //if transaction created by current user, shifting id to update chat in database--------
      if(this.userId === this.userIdCurrent){
      
        this.userIdCurrent = this.userIdEqual;

      }

      //Getting roomname OR creating newone --------------------------------------------

      let roomnme;
      console.log("RoomName Rply above",this.roomName)
      if(this.roomName == null){

      roomnme = "Room" +Math.floor((Math.random() * 100000) + 1);
      }else{

        roomnme = this.roomName;
        console.log("RoomName Rply",roomnme)

      }

      this.socket.emit('message', {
  
        "roomName": roomnme,
        "orderType": "buy",
        "transactionId": this.transactionId,
        "user1": 	this.userId,
        "user2":	this.userIdCurrent,
        "admin":	adminid.adminID,
        "messages": [{
              "Message": this.replyMessage,
              "MessageFrom": chatBy,
              "MessageFromEmail": chatByEmail,
              "isread":false,
              "isself":false,
              }]
        });

      this.replyMessage = "";


    }
//declered array -----------------
    messages = [{
      "text":"",
      "name":"",
      "self":false
    }]
    replyMessage = "";

    public chatBoolean:boolean=false;


   // Chat button function for respective transaction-------------------------------------------------------------
    chat(index:any, event:any){
      console.log(event);

      if(this.chatObject){
        this.chatObject.tempNotification = true;
      } 
    
      this.chatObject =this.container[index];
      // console.log(event);
      //clearing privious messages ------------
      console.log("newChatObj:",this.chatObject);
      
      this.chatObject.tempNotification = false;
      console.log('Condition', this.chatObject.isNotification && this.chatObject.tempNotification );
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
      if(this.userId === this.userIdCurrent){

        console.log("Tran in equal ");
        this.socket.emit('checkRooms', {

          "transactionId": this.transactionId,
          "user1": 	this.userIdCurrent
        
          });
      
      } else{
        
        this.socket.emit('getMessage', {

          "transactionId": this.transactionId,
          "user1": 	this.userId,
          "user2": 	this.userIdCurrent
        
          });
        this.chatBoolean = !this.chatBoolean;
                
        }
      }


    //comman function for updating chat in 2nd window i.e Actual chat-----------------------------------------------------------
    public chatBooleanmultiple:boolean=false;

    chatnew(index:any){

      this.chatBooleanmultiple = true;
      $(".chatbox-container").fadeIn("fast");

       //saving current chat data in vars --------
       try {
        
        this.tempTranId = this.chatRoomAllData[index].transactionId;
        this.tempUser1 = this.chatRoomAllData[index].user1;
        this.tempUser2 = this.chatRoomAllData[index].user2;
  
      
    // updating read status here ---------------------------
      this.socket.emit('updateReadStatus', {

        "transactionId":this.chatRoomAllData[index].transactionId,
        "user1":this.chatRoomAllData[index].user1,
        "user2":this.chatRoomAllData[index].user2
      
        });

        // making count zero ---------
     
        this.chatRoom[index].count=0;

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
        (data:any) => {

          if(data.MessageFrom === this.userIdCurrentMaster){
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

    notifyAdminNeeded(){

      console.log("Connecting Admin ",this.tempTranId);

       // updating read status here ---------------------------
       this.socket.emit('showAdminNotification', {

        "transactionId":this.tempTranId,
        "user1":this.tempUser1,
        "user2":this.tempUser2
      
        });

        swal({
          type: 'success',
          text: 'Notified to Admin',
          timer:2000
        })
    

    }

    closeChat(){
      this.chatBooleanmultiple = false;
      this.messages = [];
    }

    public showDetails(contract:any){
      console.log('SelectedContract',contract);
      this.selectedContract = contract;
    }

    // public imageUrl : any;
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


    ngOnDestroy(){
      if (localStorage.getItem('historyNotifications')) {
        this.historyNotifications = JSON.parse(localStorage.getItem('historyNotifications'));
        let user:any = this.userService.user;
        this.sharedService.updateNotification({ type: 'PRIVATE_CONTRACT_HISTORY', userId: user.userId, value : -(parseInt(this.historyNotifications['privateContractHistory'])), historyUserId : user._id });
  
      }
    }

}

