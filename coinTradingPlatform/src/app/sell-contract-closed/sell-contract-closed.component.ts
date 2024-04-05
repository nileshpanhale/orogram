import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { DataService } from '../../services/data.service'
import { UserService } from '../../services/user.service';
import {SearchPipe} from '../searchPipe';
declare var jsPDF: any;
declare var $:any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
import countries  from './countries';
import currency  from './currency';

import { Socket } from 'ng-socket-io';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { anyTypeAnnotation } from 'babel-types';
import { container } from '@angular/core/src/render3/instructions';
import baseUrl from '../../../BaseUrl';
import adminid from '../../../../AdminIdChat';
import { FileUploader } from 'ng2-file-upload';
import { finalize } from 'rxjs/operators';
import { SharedService } from 'services/shared.service';
import { DomSanitizer } from "@angular/platform-browser";



@Component({
  selector: 'app-sell-contract',
  templateUrl: './sell-contract-closed.component.html',
  styleUrls: ['./sell-contract-closed.component.scss'],
  providers:[SearchPipe]
})
export class SellContractClosedComponent implements OnInit {

  public selectedValue:any="";
  public selectedName:any="";
  public description:any;
  public amount:any='';
  public codes :any='';
  p: number = 1;
  public perPage:number=5;
  public country:any='';
  public index=1;
  public chosenContainer:any;
  public display=false;
  public pay_method='';
  public pay_bank='';
  public walletAddress='';
  public senderWalletAddress='';
  public accountAddresses:any
  public accountAddress:any;
  public accountCalculatedCoin:any;
  collection=countries;
  currencies = currency;
  public transactionMethod:string='';
  public totalCoin:any;
  public coinCount:any;
  public filterArray:any=[];
  public container:any;

  public roomName:any = null;
  public transactionId:any;
  public userId:any;
  public chatRoom:any=[];
  public chatRoomAllData:any=[];
  public userMessages:any = [];

  public tokenError:any='';

  public userIdCurrent:any;
  public userIdCurrentMaster:any;
  public userIdEqual:any;

  public emailCurrent:any;
  public emailCreator:any;

  pageNumbers = [1];
  currentPage=1;
  status: string;

  public isBell=false;
  public notiFlag = false;

  public tempTranId:string;
  public tempUser1:string;
  public tempUser2:string;

  public selectedContract:any;
  public baseurlip = baseUrl;

  public ethPublic:any;
  public ethPrivate:any;
  public accepterName:any;
  public accepterAddress:any;
  public accepterContact:any;
  public accepterDesc:any;

  public uploader:any;
  public cnt = 0;
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  public URL = baseUrl+'/transactionscontract/profileImageUploadMultiple';
  public formValue:any;
  public filesUpName: Array<string> = [];

  public chatroomTransactions:any = [];
  public chatObject:any;

  public count:number=0;
  public filterPayload = { isClosedContract : true };

  loading = false;
  descriptionValue = ''
  tempContainer : any;
  notifications : any;
  public bitoroPrice ="";
  public btcPrice = "";

  constructor( public router:Router, public dataService : DataService, private socket: Socket,
    public datService : DataService, public userService:UserService, public sharedService : SharedService,public sanitized: DomSanitizer) { 

      // image upload code ----------------------------
    this.uploader  = new FileUploader({url: this.URL , itemAlias: 'files'});

    this.uploader.onBeforeUploadItem = (item:any) => {
        item.withCredentials = false;
    }

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        this.cnt++;
      
        this.filesUpName.push(JSON.parse(response)[0].path);
       
        if(this.uploader.queue.length == this.cnt){
            // sending other data to server -----------------------
            this.trade();
        }
    };

    this.sharedService.notification.subscribe((res:any) => {
      if(res.type == 'PRIVATE_CONTRACT'){
        setTimeout(() => {
          this.notifications = JSON.parse(localStorage.getItem('notifications'));
        }, 2000);
      }
    })
  }

  ngOnInit() {

    if (localStorage.getItem('notifications')) {
      this.notifications = JSON.parse(localStorage.getItem('notifications'));
      let user:any = this.userService.user;
      this.sharedService.updateNotification({ type: 'PRIVATE_CONTRACT', userId: user.userId, value : -(parseInt(this.notifications['privateContractSell'])), tradeType: 'BUY', privateUserId : user.email });

    }
    
    this.getWalletAddress();
    // this.getDetails();
    this.chosenContainer={
        seller : "",
        method : "",
        price : "",
        coins : ""
    }

    // Getting all chatroom transactions -------------------------------------------------
    this.socket.emit('getAllChatData', {});

    this.socket.on('getAllChatData', (msg: any) => {
  
      this.chatroomTransactions = msg;

      this.getSellTransaction();
  
      // console.log("AllChatroomData ",msg)
  
    })
      
    // var value:any = JSON.parse( localStorage.getItem('credentials')); 
    this.dataService.getUserProfile().subscribe(
      (data:any) => {
        // console.log(data);
        this.accountAddresses = data.bankAccounts;
        this.ethPrivate = data.ethPrivateKey;
        this.ethPublic  = data.ethPublicKey;
        this.walletAddress  = data.account.address;
      },
      error => {
        // console.log(error);
      }
    )    
  // console.log("In Sell");

    //getting Gold price here ---------------------
    this.dataService.getGoldPrice().subscribe(
      (data: any) => {
          //Converting ounce to gram = data.Mid/28.3495
          // this.bitoroPrice =  Math.round((parseInt(data.Mid)/28.3495) * 100) / 100;
          this.bitoroPrice = data.goldprice;
          this.btcPrice = data.btcprice;
          // this.bitorobtc = data.bitorobtc;
      },
      error => {
          console.log(error);
      }
  )

  this.dataService.getAccountDetails().subscribe(
    (data:any) => {
      console.log(data, "data of account balance");
      // this.coinCount=this.intToDecimal(data.account.balance)
      // this.totalCoin = parseFloat(this.coinCount);
      this.totalCoin = parseFloat(this.intToDecimal(data.bal.totalCoins));

      console.log('Toatalcoin:',this.totalCoin);

      // this.accountAddress = data.account.address;
      this.accountAddress = data.address;
      this.getDetails();
    },
    (error:any) => {
      // console.log(error);
    }
  );


  //geting current user profile data ------------------------------
  this.datService.getUserProfile().subscribe(
    (data:any) => {
      this.userService.user = data;
      console.log("user data in sell",data);
      // if(data.firstName || data.lastName){
      //   this.name = data.firstName + ' ' + data.lastName;
      // }
      this.emailCurrent = data.email;
      this.userIdCurrent = data._id;
      this.userIdCurrentMaster = data._id;
      console.log('_Id:',this.userIdCurrent);
      //console.log('EmailCurrentSell:',this.emailCurrent);
      
     // this.mobile = data.mobile;
    },
    error => {
      // console.log(error);
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


  getWalletAddress(){
    this.dataService.getAccountDetails().subscribe(
      (data:any) => {
        // console.log(data);
        console.log(data,"data of account address")
        // this.senderWalletAddress = data.account.address;
        this.senderWalletAddress = data.address;
      },
      (error:any) => {
        // console.log(error);
      }
    );
  }
  
  getSellTransaction(){
    this.loading = false;
    this.dataService.getSellContractTransaction(this.perPage, this.currentPage, this.filterPayload).pipe((finalize(() => {this.loading = false}))).subscribe(
      data => {
        console.log('sell:',data);
        // console.log(data);
        this.filterArray=data['transactions'];
        this.container=data['transactions'];
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
      if((!this.count) && (data['count'])){
        this.count = data['count'];
      }
        this.generatePageNumbers(this.count);
      },
      error => {
        // console.log(error);
      }
    )
  }

  

  downloadpdf(){
    var doc = new jsPDF('p', 'pt');
    var columns = [
      {title: "Seller", dataKey:"seller" },
      {title:"Payment Method" , dataKey:"method" },
      {title: "Total Price", dataKey: "price"},
      {title: "No.of Coins", dataKey: "coins"},
  ];
    doc.autoTable(columns, this.container );
    doc.save('Buy Crypto Table.pdf');
  }

  downloadcsv(){  
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      headers:['Seller','Payment Method','Total Price','No. Of Coins']
    };

    new Angular2Csv(this.container, 'Transaction Table', options);
  }

  popup(i:any){
    let item = this.container[i];
    let cntry=item.country.toUpperCase();
    if(item.tradeType == 'bank'){
      let crncy=item.currency.toUpperCase();
      var some = `<div class="topModel" style="text-align: left !important;"><div><b>Buyer:</b>`+item.receiverWallet+"</div><br><div><b>Payment Method:</b>"+item.tradeType.toUpperCase()+"</div><br><div><b>Total Price:</b>"+item.amount+"</div><br> <div><b>No. of Coins:</b>"+this.intToDecimal(item.coins)+"</div><br><div><b>Country:</b>"+cntry+"</div><br><div><b>Currency:</b>"+crncy+"</div><br><div><b>Beneficiary Name:</b>"+this.container[i].bankAccount.beneficiary+"</div><br><div><b>Bank:</b>"+this.container[i].bankAccount.name+"</div><br><div><b>Account Number:</b>"+this.container[i].bankAccount.number+"</div><br><div><b>Swift Code:</b>"+this.container[i].bankAccount.swift+"</div><br><div><b>Country of Bank:</b>"+this.container[i].bankAccount.country+"</div><br><div><b>City:</b>"+this.container[i].bankAccount.city+"</div><br><div><b>Contract Expiry Date:</b>"+item.contractDate+"</div></div>"
    }
    else{
      var some = `<div class="topModel" style="text-align: left !important;"><div><b>Buyer:</b>`+item.receiverWallet+"</div><br><div><b>Payment Method:</b>"+item.tradeType.toUpperCase()+"</div><br><div><b>Total Price:</b>"+item.amount+"</div><br> <div><b>No. of Coins:</b>"+this.intToDecimal(item.coins)+"</div><br><div><b>Country:</b>"+cntry+"</div><br><div><b>Wallet Address:</b>"+item.receiverAccount+"</div><br><div><b>Contract Expiry Date:</b>"+item.contractDate+"</div></div>"
    }
    swal({
      title: '<strong> Contract Details </strong>',
      html:some,
      width:800,
      padding:0,
      showCloseButton: true,
      focusConfirm: false,
      // position:'top',
      confirmButtonText:
        'Ok',
      customClass: 'sweetalert-lg',
    })
  }

  //search description API call here -----------------------------------------------

  public someArray:any=[]
  searchDescription(values:any){

    this.dataService.searchDescription("payload", values).subscribe(
        (data:any) => {
            console.log("Array",this.someArray);
            console.log(data);

            this.container = data;
                
        },
        (error:any) => {
        
            this.showError(error.error.message);
        
        }
      )
  }

  buy(i:any){
    let item = this.container[i];

    //getting current transaction id and creator of transaction ------------
    this.transactionId = item._id;
    this.userId = item.creator;
    this.emailCreator = item.creatorEmail;
    
    let details = `<div class="topModel" style="text-align: left !important;"><div><b>Price:</b>`+item.price+"</div><br><div><b>Total Coin:</b>"+item.coins+"</div><br><div class='field'>Enter Coin:<input class='input' type='text' placeholder='No. of Coins'><span class='icon is-small is-left'><i class='mdi mdi-key'></i></span></p></div></div>"
    swal({
      title: '<strong> Transaction Details </strong>',
      html:details,
      width:400,
      padding:0,
      showCloseButton: true,
      focusConfirm: false,
      position:'top-end',
      confirmButtonText:
        'Ok',
      customClass: 'sweetalert-lg',
    })
  }

  callAmount(){
    let data = {
      country:this.country,
      currency:this.codes,
      amount:this.amount,
      method:this.transactionMethod,
    }
    this.dataService.filterBuy(data)
  }

  getDetails(){
    this.dataService.getAccountCoinDetail(this.accountAddress).subscribe(
      (data:any) => {
        console.log("address",data);
        console.log("smhadsambd",data);
        this.accountCalculatedCoin = parseFloat(this.intToDecimal(data.coinValue));
      },
      (error:any) => {
        // console.log(error);
      }
    );
  }

  set(i:number){
    this.index=i;
    this.chosenContainer=this.container[this.index];
    // console.log('DATA-----:', this.intToDecimal(this.chosenContainer.coins), this.intToDecimal(this.accountCalculatedCoin), (this.totalCoin) );
    console.log('In sell:',this.chosenContainer);
    // if(((parseInt(this.accountCalculatedCoin)+parseInt(this.form.value.tradeCoin))>parseInt(this.totalCoin))&&this.form.value.tradeType=='Sell'){

    if(parseFloat(this.intToDecimal(this.chosenContainer.coins * 4 / 100)) > this.totalCoin ){
      swal({
        type: 'error',
        text: 'Insufficient Coins',
        timer:2000
      })
    }
    else{
      $('#myModal').modal('show');
    }
  }
   
  setMethod(){
    if(this.pay_method == "Bank"){
      this.walletAddress = '';
    }
    else{
      this.pay_bank='';
    }
  }
  
  close(){
    this.pay_method='';
    this.pay_bank='';
    this.walletAddress='';
    this.display=false;
  }

  uploadImages(){
    if(this.uploader.queue.length > 0){
      this.uploader.uploadAll();}
      else{
        this.trade();
      }
  }

  trade(){

     this.loading= true;
    let sellId = this.chosenContainer._id
    let payload = {
      sender : localStorage.getItem('id'),
      senderAccount : this.walletAddress,
      ethPublic:this.ethPublic,
      ethPrivate:this.ethPrivate,
      //senderWallet : this.senderWalletAddress,
      receiverWallet:this.senderWalletAddress,
      nameReciever:this.accepterName,
      addressReciever:this.accepterAddress,
      contactReciever:this.accepterContact,
      remarksReciever :this.accepterDesc,
      pictureReciever:this.filesUpName
    }
    console.log("sell payload: ",payload);
    this.display=false;
    this.dataService.sellCoinsContract(payload, sellId).subscribe(
      (data:any) => {
        this.close();
        this.accepterName = '';
        this.accepterContact='';
        this.accepterDesc='';
        this.accepterAddress='';
        this.uploader.clearQueue();
        this.showSuccess(data.message);
        this.getSellTransaction();
        let user : any = this.userService.user;
        this.socket.emit('usernotification', { type: 'PRIVATE_CONTRACT_HISTORY', userId : user.userId, historyUserId : this.chosenContainer.creator});
        this.loading = false;
      },
      (error:any) => {
        // console.log(error);
        this.showError(error.error.message);
        this.close();
        this.loading = false;

      }
    )    
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

  intToDecimal (input:any){
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
      this.dataService.getSellContractTransaction(this.perPage, this.currentPage, this.filterPayload, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
        this.generatePageNumbers( this.count  );
        this.filterArray=res['transactions'];
        this.container = res['transactions'];
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
       this.loading = false;
      this.dataService.getSellContractTransaction(this.perPage, 1, this.filterPayload, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
        this.generatePageNumbers( this.count  );
        this.currentPage = 1;
        this.filterArray=res['transactions'];
        this.container = res['transactions'];
     
      });
    }


// Chat reply function ---------------------------------------------------------------------
    reply(){

         
      console.log("TranID Rply ",this.transactionId);
      console.log("TranCreator Rply ",this.userId);
      console.log("UserCurrent Rply: ",this.userIdCurrent);
      console.log("UserEqual Rply: ",this.userIdEqual);

      const chatBy = this.userIdCurrentMaster;
      const chatByEmail = this.emailCurrent;

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

      // Checking current user in all available chatrooms ----------------------------------
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

        //this.chatnew(index);

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
    
    public filterData(){
      let amountToCheck:any='';
      this.tokenError='';
      if(this.amount){
        if(this.amount.match(/^-?\d*(\.\d+)?$/)){
          amountToCheck=this.isCorrectValue(this.amount,true,8)
        }
        else{
          this.tokenError="Enter a valid number";
        }
        
      }
      if(!this.tokenError){
        let pipeValue = SearchPipe.prototype.transform(this.filterArray,amountToCheck,this.country,this.transactionMethod);
        this.container = pipeValue;
        console.log('Pipe:',pipeValue);
      }
      
    }

    public resetValue(){
      this.container = this.filterArray;
      this.country = '';
      this.amount = '';
      this.transactionMethod = '';
      this.tokenError='';
    }

    public showDetails(contract:any){
      console.log('SelectedContract',contract);
      this.selectedContract = contract;
    }

    selected: string;
  
    changeState(){
        if(this.selected.length > 2){
          this.searchDescription(this.selected)
        }
        if(this.selected.length == 1){
          this.getSellTransaction();

        }
    }

    countryChanged(country:any){
      this.filterPayload['country'] = country;
    }

    amountEntered(amount:any){
        // this.currentPage = 1;
        if(parseInt(amount)){
          this.filterPayload['coins'] = this.isCorrectValue(amount, true, 8);
        }else{
          if(this.filterPayload['coins']){
            delete this.filterPayload['coins'];
          }
        }
        // this.getBuyTransaction()
    }

    applyFilter(){
      this.currentPage = 1;
      this.getSellTransaction();
    }

    resetFilter(){
      if(this.filterPayload['coins']){
        delete this.filterPayload['coins'];
      }
      if(this.filterPayload['country']){
        delete this.filterPayload['country']
      }
      this.amount = '';
      this.currentPage = 1;
      this.country = '';
      this.getSellTransaction();
    }

    searchDescriptionValue(){
      if(this.descriptionValue){
        if(!this.tempContainer){
          this.tempContainer = this.container;
        }
        this.container = this.tempContainer.filter((ele:any) => { return ele.remarks.includes(this.descriptionValue) })
      }
      else{
        this.container = this.tempContainer;
      }
    }

      //check implementation for either pdf or image 
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
        this.sharedService.updateNotification({ type: 'PRIVATE_CONTRACT', userId: user.userId, value: -(parseInt(this.notifications['privateContractSell'])), tradeType: 'BUY', privateUserId : user.userId  });
      }
  
    }
}
