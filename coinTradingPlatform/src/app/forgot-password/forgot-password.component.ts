import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public form:FormGroup;
  public email:AbstractControl;
  public key:AbstractControl;
  public passwords:FormGroup;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;

  constructor(fb:FormBuilder, public dataService:DataService, public router:Router) {
    this.form = fb.group({
      'email' : ['',Validators.compose([Validators.required, Validators.minLength(3)])],
      'key' : ['', Validators.compose([Validators.required])],
      'passwords':fb.group({
        'password':['',Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])],
        'repeatPassword':['',Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])]
      })
    })

    this.email = this.form.controls['email'];
    this.key = this.form.controls['key'];
    this.passwords = <FormGroup>this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
   }

  ngOnInit() {
  }

  onSubmit(values:any){
    if(this.form.valid){
      let payload = {
        'email':values.email,
        'phrase':values.key,
        'password':values.passwords.password,
        'confirmPassword':values.passwords.repeatPassword
      }
      // console.log(payload);
      this.dataService.forgotPassword(payload).subscribe(
        (data:any) => {
          // console.log(data);
          this.showSuccess(data.message);
          this.router.navigate(['/login']);
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


}
