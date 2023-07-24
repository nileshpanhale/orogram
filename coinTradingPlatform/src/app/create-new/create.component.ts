import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import countries from './countries';
import currency  from './currency';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { FileUploader } from 'ng2-file-upload';
import baseUrl from '../../../BaseUrl';

import swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateNewComponent implements OnInit {

  public form:FormGroup;
  public tradeCoin:AbstractControl;
  public coinValue:AbstractControl;
  public method:AbstractControl;
  public country:AbstractControl;
  public tradeType:AbstractControl;
  public currencyType:AbstractControl;
  public wallet:AbstractControl;
  public bank:AbstractControl;  
  public accountAddresses:any;
  public accountAddress:any;
  public test:any;
  public totalCoin:any;
  public coinCount:any;
  public accountCoin:any;
  public accountCalculatedCoin:any;
  public remarks:any;
  public contract:any;
  public contractdate:any;
  public isLoading=true;
  public senderId:any;
  public receiverId:any;
  currencies = currency;
  collection=countries;


  constructor(fb:FormBuilder, public userService : UserService, public dataService:DataService) {
    this.form = fb.group({
      'tradeCoin':['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")])],
      'coinValue':['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")])],
      'method':['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country':['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'tradeType':['', Validators.compose([Validators.required,])],
      'currencyType':['', ],
      'wallet':['', Validators.compose([])],
      'bank':['', Validators.compose([])],
      'contractdate':['', Validators.compose([Validators.required])],
      'contract':['', Validators.compose([Validators.required])],
      'remarks':['', Validators.compose([Validators.required])],
    });

    this.tradeCoin = this.form.controls['tradeCoin'];
    this.coinValue = this.form.controls['coinValue'];
    this.method = this.form.controls['method'];
    this.country = this.form.controls['country'];
    this.tradeType = this.form.controls['tradeType'];
    this.currencyType = this.form.controls['currencyType'];
    this.wallet = this.form.controls['wallet'];
    this.bank = this.form.controls['bank'];
    this.remarks = this.form.controls['remarks'];
    this.contractdate = this.form.controls['contractdate'];
    this.contract = this.form.controls['contract'];
   }

  ngOnInit() {
    this.dataService.getAccountDetails().subscribe(
      (data:any) => {

        this.isLoading=false;
        this.coinCount=this.intToDecimal(data.account.balance)
        this.totalCoin = parseFloat(this.coinCount);
        this.accountAddress = data.account.address;
        this.getDetails();
      },
      (error:any) => {
        // console.log(error);
      }
    );
    this.dataService.getUserProfile().subscribe(
      (data:any) => {
        this.userService.user = data;
        // console.log(data);
        this.accountAddresses=data.bankAccounts;
        
      },
      error => {
        // console.log(error);
      });
      
  }

  getDetails(){
    this.dataService.getAccountCoinDetail(this.accountAddress).subscribe(
      (data:any) => {
        // console.log("address",this.accountAddress);
        
        this.accountCoin = this.intToDecimal(data.coinValue);
        this.accountCalculatedCoin = parseFloat(this.accountCoin);
       
      },
      (error:any) => {
        // console.log(error);
      }
    );
  }

  submit(values:any){
   
    this.form.reset();

    if(((parseInt(this.accountCalculatedCoin)+parseInt(this.form.value.tradeCoin))>parseInt(this.totalCoin))&&this.form.value.tradeType=='Sell'){
      this.showError("Insufficient balance, Cancel some orders then try again");
    }
    else{
      if(values.tradeType == "Buy" && values.tradeCoin > this.totalCoin){
        // console.log('In the condition');
        
        swal({
          type: 'error',
          text: "Placed Order should be less than the Balance ",
          timer:2000
        })
      }
      else{
          // console.log('Valid');
          // Specifying sender and receiver account according to transaction type-------------------------------------
          let senderAc, receiverAc;
          
          if(values.tradeType == "Sell"){

            receiverAc = (values.bank || values.wallet);
            this.receiverId = localStorage.getItem('id');
            senderAc = null;
            this.senderId = null;

          }else if(values.tradeType == "Buy"){

            senderAc = (values.bank || values.wallet);
            this.senderId = localStorage.getItem('id');
            receiverAc = null;
            this.receiverId = null;
          }


          let payload;
  
              payload = {
              currency:values.currencyType,
              tradeType: values.tradeType.toLowerCase().split(' ')[0],
              tranMethod: values.method.toLowerCase().split(' ')[0],
              tranCreatorId: localStorage.getItem('id'),
              senderAccount: senderAc,
              senderId:this.senderId,
              receiverId:this.receiverId,
              receiverAccount:receiverAc,
              coins: this.isCorrectValue(values.tradeCoin, true, 8),
              amount : values.coinValue,
              country: values.country,
              tranRemarks:values.remarks,
              tranExpiryDate:values.contractdate,
              TranContractText:values.contract
              }
          
     console.log("This is payload in create component:", payload);
         
    //  this.dataService.createNewOrder(payload).subscribe(
    //         (data:any) => {
    //           // console.log(data);
    //           this.form.reset();
    //           this.showSuccess(data.message);
    //         },
    //         error => {
    //           // console.log(error);
    //           this.showError(error.error.message);
    //         }
    //       )
          // console.log("payload coins",payload.coins)
      }
    }
  }

  partialUpdate(){
    if(this.form.value.method == 'Wallet'){
      this.form.patchValue({
        'bank':''
      })
    }
    else{
      this.form.patchValue({
        'wallet':''
      })
    }
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

}
