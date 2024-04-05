import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import {FormGroup, AbstractControl, FormBuilder, Validators, Form} from '@angular/forms';
import countries  from './countries';
import { VALID } from '@angular/forms/src/model';
declare var $:any;

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {

  public form:FormGroup;
  public accountNumber:AbstractControl;
  public swiftCode:AbstractControl;
  public city:AbstractControl;
  public country:AbstractControl;
  public bankName:AbstractControl;
  public beneficiary:AbstractControl;
  public accountAddresses:any = [];
  public collection=countries;
  // public opacityValue=0.5;

  constructor(public dataService : DataService, public fb:FormBuilder) {
    // this.form = fb.group({
    //   'beneficiary':['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(5)])],
    //   'accountNumber':['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(5), Validators.pattern('^[0-9]*$')])],
    //   'swiftCode':['', Validators.compose([Validators.required,, Validators.minLength(3), Validators.maxLength(15)])],
    //   'city':['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(5)])],
    //   'bankName':['', Validators.compose([Validators.required, Validators.minLength(5),Validators.maxLength(50)])],
    //   'country':['', Validators.compose([Validators.required,Validators.maxLength(50), Validators.minLength(5)])],
    // });

    this.form = fb.group({
      'beneficiary':['', Validators.compose([Validators.required])],
      'accountNumber':['', Validators.compose([Validators.required, Validators.pattern('^[0-9 A-Z a-z]*$')])],
      'swiftCode':['', Validators.compose([Validators.required])],
      'city':['', Validators.compose([Validators.required])],
      'bankName':['', Validators.compose([Validators.required])],
      'country':['', Validators.compose([Validators.required])],
    });
    this.beneficiary = this.form.controls['beneficiary'];
    this.accountNumber=this.form.controls['accountNumber'];
    this.swiftCode = this.form.controls['swiftCode'];
    this.city = this.form.controls['city'];
    this.country = this.form.controls['country'];
    this.bankName = this.form.controls['bankName'];
   }

  ngOnInit() {
    // this.accountAddresses={};
    this.dataService.getUserProfile().subscribe(
      (data:any) => {
        // console.log(data);
        this.accountAddresses = data.bankAccounts;
      },
      error => {
        // console.log(error);
      }
    )
  }

  ngAfterViewInit() {
    
  }

  close(){
    this.form.reset();
  }

  onSubmit(values:any){
    let payload = {
      bankName : values.bankName,
      beneficiary:values.beneficiary,
      accountNumber : values.accountNumber,
      city : values.city,
      country : values.country,
      swiftCode : values.swiftCode,
    }
    console.log(payload);
    this.dataService.createAccount(payload).subscribe(
      (data:any) => {
        // console.log(data);
        this.form.reset();
        this.dataService.getUserProfile().subscribe(
          (data:any) => {
            // console.log(data);
            this.accountAddresses = data.bankAccounts;
            $('#myModal').modal('hide');
          },
          error => {
            // console.log(error);
          }
        )
      },
      (error:any) => {
        // console.log(error);
      }
    )
  }

}
