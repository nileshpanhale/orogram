import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import swal from 'sweetalert2';


@Component({
  selector: 'sendCoin',
  templateUrl: 'sendCoin.html'
})

export class SendCoin{

    public sendCoin:FormGroup;
    public error:any; 
    public scannedCode=null;

    constructor(public dataService:DataService, private barcodeScanner: BarcodeScanner, public fb:FormBuilder, ){
        this.sendCoin = fb.group({
            address:['',Validators.compose([Validators.required, Validators.minLength(4)])],
            coin:['', Validators.compose([Validators.required, Validators.pattern(/(\d+(\.\d+)?)/) ])]
        })

        }

    submitForm(){
        
        if(this.sendCoin.valid){
            let payload = {
                'walletAddress':this.sendCoin.value.address,
                'coins':this.isCorrectValue(this.sendCoin.value.coin, false, 8)
            }
            this.dataService.sendCoin(payload).subscribe(
                data => {
                    console.log(data);
                    this.showSuccess('Successfully Transferred');
                    this.sendCoin.reset();
                },
                error => {
                    console.log(error);
                    this.error = error;
                    this.showError(error);
                }
            )
        }
    }

  
    scanQR(){
      this.barcodeScanner.scan().then(
        barcodeData => {
          this.scannedCode = barcodeData.text;
          this.sendCoin.patchValue({address: this.scannedCode})
        },    
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