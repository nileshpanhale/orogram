import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import countries from './countries';
import currency from './currency';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload';
import baseUrl from '../../../BaseUrl';
import { Socket } from 'ng-socket-io';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  public form: FormGroup;
  public tradeCoin: AbstractControl;
  public coinValue: AbstractControl;
  public method: AbstractControl;
  public country: AbstractControl;
  public tradeType: AbstractControl;
  public currencyType: AbstractControl;
  public wallet: AbstractControl;
  public bank: AbstractControl;
  public accountAddresses: any;
  public accountAddress: any;
  public test: any;
  public totalCoin: any;
  public coinCount: any;
  public accountCoin: any;
  public accountCalculatedCoin: any;
  public remarks: any;
  public isLoading = true;
  public isContract = false;
  currencies = currency;
  collection = countries;

  public buttonflag = false;

  public emailId: any;

  public btcPrice = ""
  public btcPriceeur = ""
  public bitoroPrice: any;
  public bitorobtc = ""

  public imageArr: any;
  public uploader: any;
  public URL = baseUrl + '/transactions/profileImageUploadMultiple';
  public cnt = 0;
  public filesUpName: Array<string> = [];
  public formValue: any;
  public loading = false;


  constructor(fb: FormBuilder, public userService: UserService, public dataService: DataService, private socket: Socket) {
    this.form = fb.group({
      'tradeCoin': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,7})?$/)])],
      'coinValue': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,4})?$/)])],
      'method': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'country': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'tradeType': ['', Validators.compose([Validators.required,])],
      'currencyType': ['',],
      'wallet': ['', Validators.compose([])],
      'bank': ['', Validators.compose([])],
      'remarks': ['', Validators.compose([Validators.required])]
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

    // image upload code ----------------------------
    this.uploader = new FileUploader({ url: this.URL, itemAlias: 'files' });

    this.uploader.onBeforeUploadItem = (item: any) => {
      item.withCredentials = false;
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.cnt++;

      this.filesUpName.push(JSON.parse(response)[0].path)

      if (this.uploader.queue.length == this.cnt) {
        // sending other data to server -----------------------
        this.submit(this.formValue);
        this.cnt = 0;
      }
    };
  }

  ngOnInit() {
    this.dataService.getAccountDetails().subscribe(
      (data: any) => {

        this.isLoading = false;
        this.coinCount = data.bal.calculatedCoins;
        this.totalCoin = parseFloat(this.coinCount);
        this.accountAddress = data.address;
        this.getDetails();
      },
      (error: any) => {
        // console.log(error);
      }
    );
    this.dataService.getUserProfile().subscribe(
      (data: any) => {
        console.log("Received user details : ", data);
        this.userService.user = data;
        this.accountAddresses = data.bankAccounts;
        this.emailId = data.email;

      },
      error => {
        // console.log(error);
      });

    this.dataService.getGoldPrice().subscribe(
      (data: any) => {

        this.bitoroPrice = data.goldprice;
        this.btcPrice = data.btcprice;
        this.bitorobtc = data.bitorobtc;

      },
      error => {
        console.log(error);
      }
    )

  }

  getDetails() {
    this.dataService.getAccountCoinDetail(this.accountAddress).subscribe(
      (data: any) => {

        this.accountCoin = this.intToDecimal(data.coinValue);
        this.accountCalculatedCoin = parseFloat(this.accountCoin);

      },
      (error: any) => {
        // console.log(error);
      }
    );
  }

  uploadImages(values: any) {
    this.loading = true;

    if (values.tradeType == "Sell" || values.tradeType == "sell") {

      if (!this.uploader.queue.length) {               // if there is no file to upload
        this.submit(values);
      } else {
        this.loading = true;
        this.formValue = values;
        this.uploader.uploadAll()
      }
    }
    else {
      this.loading = true;
      this.submit(values);
    }

  }

  submit(values: any) {

    this.buttonflag = true;
    const remarks = this.getLink(values.remarks);

    if (((parseInt(this.form.value.tradeCoin) * 1.01) > parseInt(this.totalCoin)) && this.form.value.tradeType == 'Sell') {
      this.showError("Insufficient balance, Cancel some orders then try again");
    }
    else if (((parseInt(this.form.value.tradeCoin) * 0.04) > parseInt(this.totalCoin)) && this.form.value.tradeType == 'Buy') {
      this.showError("Insufficient balance, Cancel some orders then try again");
    }
    else {
      if (values.tradeType == "Buy" && (values.tradeCoin * 0.04) > this.totalCoin) {

        swal({
          type: 'error',
          text: "Placed Order should be less than the Balance ",
          timer: 2000
        })
      }
      else {

        let payload;
        if (values.tradeType == "Buy") {
          payload = {
            currency: values.currencyType,
            type: "trade",
            creatorEmail: this.emailId,
            tradeType: values.method.toLowerCase().split(' ')[0],
            requested: true,
            receiver: localStorage.getItem('id'),
            receiverAccount: (values.bank || values.wallet),
            coins: this.isCorrectValue(values.tradeCoin, true, 8),
            amount: values.coinValue,
            country: values.country,
            contractDate: "",
            isContract: this.isContract,
            remarks: remarks
          }
        }
        if (values.tradeType == "Sell") {
          payload = {
            currency: values.currencyType,
            type: "trade",
            creatorEmail: this.emailId,
            tradeType: values.method.toLowerCase().split(' ')[0],
            requested: false,
            sender: localStorage.getItem('id'),
            senderAccount: (values.bank || values.wallet),
            coins: this.isCorrectValue(values.tradeCoin, true, 8),
            amount: values.coinValue,
            picture: this.filesUpName,
            country: values.country,
            contractDate: "",
            isContract: this.isContract,
            remarks: remarks
          }
        }
        this.dataService.createOrder(payload).subscribe(
          (data: any) => {
            this.form.reset();
            this.uploader.clearQueue();
            this.showSuccess("Trade Created Successfully");
            this.loading = false;
            this.buttonflag = false;
            let user: any = this.userService.user;
            this.socket.emit('usernotification', { type: 'TRADE_ORDER', userId: user.userId, tradeType: values.tradeType.toUpperCase() });
            window.location.reload();
          },
          error => {
            // console.log(error);
            this.loading = false;
            this.showError(error.error.message);
          }
        )
        console.log("payload coins", payload.coins)
      }
    }
  }

  partialUpdate() {
    if (this.form.value.method == 'Wallet') {
      this.form.patchValue({
        'bank': ''
      })
    }
    else {
      this.form.patchValue({
        'wallet': ''
      })
    }
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
    if (!input || input < 0) {
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

  uploadFile() {
    const formData = new FormData();
    formData.append('profileImage', this.imageArr, this.imageArr.name);
    this.dataService.imageuploadmulti(formData).subscribe(res => {
      this.userService.user['picture'] = res['imageUrl'];
    }, (error) => {
      // console.log(error, "error from server");

    });
  }

  getLink(values: any) {

    // Create a regular expression to match URLs
    var urlRegex = /(https?:\/\/|www\.[^\s]+)/g;
    console.log("check content : ", values.replace(urlRegex, `<a href="http://$1" >$1</a>`));

    // Replace the URLs with HTML links
    return (values.replace(urlRegex, `<a href="http://$1" target="_blank" >$1</a>`));

  }

}
