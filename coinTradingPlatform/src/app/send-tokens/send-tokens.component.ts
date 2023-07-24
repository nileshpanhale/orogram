import { Component, OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv';
import { DataService } from '../../services/data.service';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
declare var jsPDF: any;
import swal from 'sweetalert2';  
import 'jspdf-autotable';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-send-tokens',
  templateUrl: './send-tokens.component.html',
  styleUrls: ['./send-tokens.component.css']
})
export class SendTokensComponent implements OnInit {
  public remarks:any;
  public perPage:number=20;
  p: number = 1;
  public form:FormGroup;
  public noOfcoins:AbstractControl;
  public address:AbstractControl;
  public container:any;
  public walletAddress:any='';
  public description:any;
  public submitted:boolean = false;

   public totalCoin:any;
  public coinCount:any;
  public someValue='';

  submitLoader = false;
  errors = '';
  adminBalance:number;

  pageNumbers = [1];
  currentPage=1;
  status: string;

  count:number=0;
  loading = true;

  constructor(public userService:DataService,fb: FormBuilder) { 
   
    this.form = fb.group({
      'noOfcoins' : ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,7})?$/)])],
      'address' : ['',Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(34), Validators.pattern(/^\w*$/)])],
      'remarks':['']
    })

    this.noOfcoins = this.form.controls['noOfcoins']; 
    this.address = this.form.controls['address'];
    this.remarks=this.form.controls['remarks'];
  }
 
  ngOnInit() {
    this.getAdminTx(); 
    this.userService.getAccountDetails().subscribe(
      (data:any) => {
        this.walletAddress = data.account.address;
       
        // console.log(data,"user profile");
        //console.log("wallet",this.walletAddress);
       // let balance = data.account.balance;
        // console.log(this.intToDecimal(balance),'No. of Coins');
       // console.log(data,"user profile");
       // this.adminBalance = parseFloat(this.intToDecimal(balance));
        console.log(data.actualbalance,"UUACTBAL_BEFORE");
       

        //this.coinCount=this.intToDecimal(data.totalCoins)
        //this.holdedCoinS=this.intToDecimal(data.totalHolded)
        this.adminBalance= parseFloat(this.intToDecimal(data.actualbalance));
        console.log(this.adminBalance,"UUACTBAL");

        // console.log('Admin Balance',this.adminBalance);
        
      },
      error => {
        // console.log(error);
      }
    )
  }
  get f() {  return this.form.controls; }
  getAdminTx(){
    this.loading = true;
    this.userService.getAdminTx().pipe((finalize(() => {this.loading = false}))).subscribe(
      (data:any) => {
        console.log("UserSendCoin",data.data);
        this.container = data.data;
        this.container.sort((x : any, y : any) =>{
          return Date.parse(y.updatedAt) - Date.parse(x.updatedAt);
      });
        if((!this.count) && (data['count'])){
          this.count = data['count'];
        }
        this.generatePageNumbers( this.count  );
        // this.store = data;
      },
      error => {
        // console.log("error",error);
      }
    )
  }

  onSubmit(values:any):void{
    this.submitLoader = true; 
    // this.loading = true;
    // console.log(values);
    if(this.form.valid){
      let payload = {
        'coins':this.isCorrectValue(values.noOfcoins, true,8),
        'walletAddress':values.address.trim(),
        'remarks':values.remarks
         }
         console.log('payloadCoins',payload);
         
        this.userService.sendCoin(payload).subscribe(
        (data:any) => {
          this.showSuccess('Successfully Transferred');
          this.getAdminTx();
          this.form.reset();
          this.submitLoader = false;
        },
        (error:any) => {
          // console.log(error);
          this.showError(error.error.message);
          this.submitLoader = false;
        }
      )
    }
  }

  downloadpdf(){
    var doc = new jsPDF('p', 'pt');
    var columns = [
      {title: "Transaction Id", dataKey: "transactionId"},
      {title: "Date", dataKey: "createdAt"},
      {title: "Description", dataKey: "remarks"},
      {title: "Receiver Address", dataKey: "receiverAccount"}, 
      {title: "No of Coins", dataKey: "coins"}   
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
      headers:['Transaction Id','Date', 'Description','Receiver Address','No of Coins']
    };

    new Angular2Csv(this.transform(), 'Transaction Table', options);
  }



  transform() {
    let allowedFields = ['transactionId', 'createdAt', 'remarks','receiverAccount' ,'coins',]
    let temp = {};
    let transformed:any = []
    this.container.forEach((transaction: any) => {
      temp = {};
      allowedFields.forEach(field => {
        if(field == 'createdAt'){ 
          temp[field] = transaction[field].split("T")[0];
        }
        else {
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

  intoDateFormat (input:any) {
    // console.log("111", input)
    let ts = new Date(input)
    // return ts.toLocaleString()
    return ts.toUTCString()


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

    // if(this.description.length > 3){
    //   this.container=this.bucket;
    // }
    // else{
    //   this.container = this.data;
    // }
  }

  open(){
    // console.log(this.perPage);
  }

  show(){
    // console.log("In show");
  }

   //sorting
   key: string = 'walletaddress'; //set default
   reverse: boolean = false;
   sort(key:any){
     this.key = key;
     this.reverse = !this.reverse;
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

    fullTimestamp(time:any)

    {
     let d = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0));
     let t = parseInt((d.getTime() / 1000) +'');
   
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
   
     return day+'-'+month+'-'+d.getFullYear();
   }


   setActive() {
    let li = document.getElementsByClassName('navlist1');
    // console.log(this.currentPage, "current pagwe");
    // console.log(li, "lisssss");
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
    this.userService.getAdminTx(this.perPage, this.currentPage, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.container = res['transfers'];
    });
  }

   generatePageNumbers(value:any) {
    let limit = Math.ceil( (value/this.perPage) );
    this.pageNumbers.splice(0, this.pageNumbers.length);
    for(let i=1; i<=limit; i++) {
    this.pageNumbers.push(i);
    }
  }

   perPageChange() {
     this.loading = true;
    this.userService.getAdminTx(this.perPage,1, this.status).pipe((finalize(() => {this.loading = false}))).subscribe( res => {
      this.generatePageNumbers( this.count  );
      this.currentPage = 1;
      this.container = res['transfers'];
      // this.setActive();
    });
  }
    
}