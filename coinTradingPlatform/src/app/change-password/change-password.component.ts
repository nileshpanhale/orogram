import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import swal from 'sweetalert2';
import { environment } from '@env/environment';
import { CheckSecretKeyService } from '../../services/checksecretKey.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public form:FormGroup;
  public email:AbstractControl;
  public oldPassword:AbstractControl;
  public passwords:FormGroup;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public equalpass = false;

  constructor(fb:FormBuilder, public dataService:DataService, public router:Router) {
    this.form = fb.group({
      'oldPassword' : ['',Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])],
      'passwords':fb.group({
        'password':['',Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])],
        'repeatPassword':['',Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])]
      })
    })

    this.oldPassword = this.form.controls['oldPassword'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];


   }

   
  ngOnInit() { }
  onSubmit(values:any){
    if(this.form.valid){
      let payload = {
        'oldPassword':values.oldPassword,
        'password':values.passwords.password,
        'confirmPassword':values.passwords.repeatPassword
      }
      // console.log(payload);
      this.dataService.updatePassword(payload).subscribe(
        (data:any) => {
          this.showSuccess(data.message);
          this.form.reset();
          // console.log(data);
        },
        (error:any) => {
            this.showError(error.error.message);
          // console.log(error);
        }
      )
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

  checkPassword(){
    if(this.oldPassword.value == this.password.value){
console.log(true);

      this.equalpass = true;

    }
  }
}
