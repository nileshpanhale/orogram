import {
    Component,
    OnInit, ViewChild
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl
} from '@angular/forms';
import countries from './countries';
import currency from './currency';
import {
    UserService
} from '../../services/user.service';
import { DataService } from '../../services/data.service';
import swal from 'sweetalert2';
import { FileUploader } from 'ng2-file-upload';
import baseUrl from '../../../BaseUrl';
import { Socket } from 'ng-socket-io';

@Component({
    selector: 'app-create',
    templateUrl: './create-contract.component.html',
    styleUrls: ['./create-contract.component.scss']
})

export class CreateContractComponent implements OnInit {

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
    public isContract = true;
    public contractdate: any;
    public localUrl: any = [];
    public imageArr: any;
    public myFile: any;
    public filesToUpload: Array<File> = [];
    public filesUpName: Array<string> = [];
    public ethPublic: any;
    public ethPrivate: any;
    public formValue: any;
    private formData1 = new FormData();
    currencies = currency;
    collection = countries;
    public emailId: any;
    public loading = false;
    public btcPrice = ""
    public btcPriceeur = ""
    public bitoroPrice: any;
    public bitorobtc = ""
    public uploader: any;
    public cnt = 0;
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    public URL = baseUrl + '/transactionscontract/profileImageUploadMultiple';
    minimumDate = new Date()
    now = new Date();
    day: any;
    month: any;
    today: any;

    constructor(fb: FormBuilder, public userService: UserService, public dataService: DataService, private socket: Socket) {
        this.day = ("0" + this.now.getDate()).slice(-2);
        this.month = ("0" + (this.now.getMonth() + 1)).slice(-2);
        this.today = this.now.getFullYear() + "-" + (this.month) + "-" + (this.day);
        // image upload code ----------------------------
        this.uploader = new FileUploader({ url: this.URL, itemAlias: 'files' });
        this.uploader.onBeforeUploadItem = (item: any) => {
            item.withCredentials = false;
        }
        this.uploader.onAfterAddingFile = (item: any) => {
            item.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.cnt++;
            this.filesUpName.push(JSON.parse(response)[0].path)
            if (this.uploader.queue.length == this.cnt) {
                // sending other data to server -----------------------
                this.submit(this.formValue);
                this.cnt = 0;
            }
        };

        this.form = fb.group({
            'tradeCoin': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d+(\.\d{0,7})?$/)])],
            //'coinValue':['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")])],
            //'method':['', Validators.compose([])],
            'country': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'tradeType': ['', Validators.compose([Validators.required])],
            'currencyType': ['',],
            // 'wallet': ['', Validators.compose([])],
            //'bank':['', Validators.compose([])],
            'contractdate': ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^\d{0,2}$/)])],
            'remarks': ['', Validators.compose([Validators.required])]
        });

        this.tradeCoin = this.form.controls['tradeCoin'];
        //this.coinValue = this.form.controls['coinValue'];
        //this.method = this.form.controls['method'];
        this.country = this.form.controls['country'];
        this.tradeType = this.form.controls['tradeType'];
        // this.currencyType = this.form.controls['currencyType'];
        //this.wallet = this.form.controls['wallet'];
        // this.bank = this.form.controls['bank'];
        this.remarks = this.form.controls['remarks'];
        this.contractdate = this.form.controls['contractdate'];
    }

    //image code ----------
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
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
                this.userService.user = data;
                this.accountAddresses = data.bankAccounts;
                this.emailId = data.email;
                this.wallet = data.account.address;
                this.ethPrivate = data.ethPrivateKey;
                this.ethPublic = data.ethPublicKey;
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
                console.log(error);
            }
        );
    }


    uploadImages(values: any) {
        this.loading = true;
        this.formValue = values;
        this.uploader.uploadAll()
        // this.submit(this.formValue);
    }

    submit(values: any) {
        this.form.reset();
        const tradeSum = values.tradeCoin + (values.tradeCoin * 0.04);
        const remarks = this.getLink(values.remarks);
        console.log("Remark check : ", remarks);

        if (((parseFloat(this.form.value.tradeCoin) * 1.02) > parseFloat(this.totalCoin)) && this.form.value.tradeType == 'Buy') {
            this.showError("Insufficient balance, Cancel some orders then try again");
        }
        else {
            if (values.tradeType == "Buy" && (parseFloat(values.tradeCoin) * 1.02) > parseFloat(this.totalCoin)) {
                swal({
                    type: 'error',
                    text: "Placed Order should be less than the Balance ",
                    timer: 2000
                })
            } else {

                //here sending data to server-------------------------------------
                let payload;
                let coords=JSON.parse(localStorage.getItem("createCoords"))

                if (values.tradeType == "Buy") {
                    payload = {
                        type: "trade",
                        creatorEmail: this.emailId,
                        requested: true,
                        receiver: localStorage.getItem('id'),
                        receiverAccount: this.wallet,
                        coins: this.isCorrectValue(values.tradeCoin, true, 8),
                        country: values.country,
                        contractDays: values.contractdate,
                        remarks: remarks,
                        picture: this.filesUpName,
                        ethPrivate: this.ethPrivate,
                        ethPublic: this.ethPublic,
                        isContract: this.isContract,
                        lat: 31.630628,
                        lng: -7.990161
                    }
                }
                if (values.tradeType == "Sell") {
                    payload = {
                        type: "trade",
                        creatorEmail: this.emailId,
                        requested: false,
                        sender: localStorage.getItem('id'),
                        senderAccount: this.wallet,
                        coins: this.isCorrectValue(values.tradeCoin, true, 8),
                        country: values.country,
                        contractDays: values.contractdate,
                        remarks: remarks,
                        picture: this.filesUpName,
                        ethPrivate: this.ethPrivate,
                        ethPublic: this.ethPublic,
                        isContract: this.isContract,
                        lat: 31.630628,
                        lng: -7.990161
                    }
                }

                this.dataService.createContractOrder(payload).subscribe(
                    (data: any) => {
                        this.form.reset();
                        this.uploader.clearQueue();
                        this.showSuccess("Contract Created Successfully");
                        this.loading = false;
                        let user: any = this.userService.user;
                        this.socket.emit('usernotification', { type: 'CREATE_CONTRACT', userId: user.userId, tradeType: values.tradeType.toUpperCase() });
                        window.location.reload();
                    },
                    error => {
                        this.loading = false;
                        this.showError(error.error.message);

                    }
                )

            }
        }
    }

    partialUpdate() {
        if (this.form.value.method == 'Wallet') {
            this.form.patchValue({
                'bank': ''
            })
        } else {
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

    showPreviewImage(event: any) {
        this.formData1.append("files", event.target.files[0], event.target.files[0].name)
        this.filesToUpload = event.target.files;

        this.imageArr = event.target.files;
        for (let i = 0; i < this.imageArr.length; i++) {

            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.imageArr[i].localUrl = event.target.result;
            }
            reader.readAsDataURL(this.imageArr[i]);
        }
    }

    uploadFile() {
        const formData = new FormData();
        formData.append('profileImage', this.imageArr, this.imageArr.name);
        this.dataService.imageuploadmulti(formData).subscribe(res => {
            console.log(res, "res from server");
            this.userService.user['picture'] = res['imageUrl'];
        }, (error) => {

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
