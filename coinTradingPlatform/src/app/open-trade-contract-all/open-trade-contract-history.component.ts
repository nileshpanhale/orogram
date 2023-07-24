import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service'
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import baseUrl from '../../../BaseUrl';
import adminid from '../../../../AdminIdChat';
declare var jsPDF: any;
import 'jspdf-autotable';
import swal from 'sweetalert2';
import { tick } from '@angular/core/src/render3';
import { Socket } from 'ng-socket-io';
declare var $:any;

@Component({
  selector: 'app-tradeHistory',
  templateUrl: './open-trade-contract-history.component.html',
  styleUrls: ['./open-trade-contract-history.component.scss']
})
export class TradeContractHistoryAllComponent implements OnInit 

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
    public address:AbstractControl;

    pageNumbers = [1];
    currentPage=1;
    status: string;
    public form:FormGroup;


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


  public tempTranId:string;
  public tempUser1:string;
  public tempUser2:string;

  public ethPublic:any;
  public ethPrivate:any;
  public selectedContract:any;
  public baseurlip = baseUrl;

  public chatroomTransactions:any = [];
  public chatObject:any;

  
    constructor( public dataService : DataService, public router:Router, public userService : UserService, private socket: Socket,fb: FormBuilder) {

    
        this.form = fb.group({
         
          'address' : ['', Validators.compose([Validators.required, Validators.minLength(5)])],
          
        })
    
       
        this.address = this.form.controls['address'];
       
      






     }
  
    ngOnInit() {
      this.getPurchaseTransaction();
     


     
//-----------------------------------------------------------------
    }


    getPurchaseTransaction(){
      this.dataService.getTradeContractAllHistory().subscribe(
        (data:any) => {
          console.log(data);
                    
         
          this.container = data.transactions;
          this.temp = this.container;
          this.tempCount = data['count'];
          this.generatePageNumbers( data['count']  );  

          },
        (error:any) => {
          // console.log(error);
        }
      )
    }
 
    
    search(){
      if( this.description.length > 3) {
        this.dataService.getTradeContractAllHistory(this.perPage, this.currentPage, this.description).subscribe( (result:any) => {
          // console.log(result, "result");
          this.generatePageNumbers( result.count  );
          this.container = result.transactions;
        })
      }
      else{
        this.generatePageNumbers( this.tempCount  );
        this.container = this.temp;
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
        this.dataService.getTradeContractAllHistory(this.perPage, this.currentPage, this.status).subscribe( res => {
          this.generatePageNumbers( res['count']  );
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
        this.dataService.getTradeContractAllHistory(this.perPage,1, this.status).subscribe( res => {
          this.generatePageNumbers( res['count']  );
          this.tempCount = res['count'];
          this.currentPage = 1;
          this.container = res['transactions'];
          this.temp = this.container;
          // console.log(this.container);
          
          // this.setActive();
        });
      }


    public showDetails(contract:any){
      console.log('SelectedContract',contract);
      this.selectedContract = contract;
    }

}

