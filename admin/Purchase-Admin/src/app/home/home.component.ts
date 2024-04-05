import { Component, OnInit } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, Form} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user.service';
import swal from 'sweetalert2';
import { UserResponseService } from '../../Services/userResponse.service';
import { EqualPasswordsValidator } from '../theme/equalPasswordValidator';
import { EmailValidator } from '../theme/emailValidator';

// import { loadavg } from 'os';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public form:FormGroup;
  public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;
  public emailId:string;
  public loginSuccess=false;

  public otpForm:FormGroup;
  public otp:AbstractControl;

  public fpForm :  FormGroup;
  public key:AbstractControl;
  public isCaptcha:boolean = false;

  public isLoading=false;
  public rpForm:FormGroup;
  public passwords:FormGroup;
  public resetPassword:AbstractControl;
  public resetPasswordRepeat:AbstractControl;
  public error : string;

  public login:boolean = true;
  public OTP:boolean = false;
  public fpsw:boolean = false;
  public rpsw:boolean = false;

  constructor(fb:FormBuilder, public userService:UserService, public router:Router, public userResponseService:UserResponseService) {
    this.form=fb.group({
      'email':['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), EmailValidator.validate])],
      // 'password':['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])],
      'password':['', Validators.compose([Validators.required, Validators.minLength(4) ])]

    });

    this.otpForm=fb.group({
      'otp':['', Validators.compose([ Validators.required, Validators.minLength(4), Validators.maxLength(6), Validators.pattern(/^\d*[1-9]\d*$/)])]
    });

    this.fpForm=fb.group({
      'key':['', Validators.compose([Validators.required, Validators.minLength(24)])],
      'passwords' : fb.group({
        'resetPassword':['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
        'resetPasswordRepeat':['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(25)])]},
        {validator: EqualPasswordsValidator.validate('resetPassword', 'resetPasswordRepeat')
      })
    });

    this.rpForm=fb.group({
      
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];

    this.otp = this.otpForm.controls['otp'];

    this.key = this.fpForm.controls['key'];
    this.passwords = <FormGroup>this.fpForm.controls['passwords'];
    this.resetPassword = this.passwords.controls['resetPassword'];
    this.resetPasswordRepeat = this.passwords.controls['resetPasswordRepeat'];
   }

  ngOnInit() {
    if(localStorage.getItem('access_token')){
      this.router.navigate(['/admin/dashboard'])
    }
  }

  public onSubmit(values:any):void{
    console.log("Val",values)
    this.submitted = true;
    if(this.form.valid){
      this.userService.login(values).subscribe(
        (data:any) => {
          console.log(data);
          if(data.token){
            this.userResponseService.user = data.user;
            localStorage.setItem('access_token', data.token.accessToken);
            localStorage.setItem('tokenType', data.token.tokenType);
            localStorage.setItem('refreshToken', data.token.refreshToken);
            localStorage.setItem('expiresIn', data.token.expiresIn);
            localStorage.setItem('userId', data.user.userId);
            localStorage.setItem('isActive', data.user.isActive);
            localStorage.setItem('email', data.user.email);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('emailVerified', data.user.emailVerified);
            localStorage.setItem('lastUpdatedPassword',data.user.lastUpdatedPassword);
            localStorage.setItem('id',data.user._id);
            localStorage.setItem('picture',data.user.picture);
            // localStorage.setItem("profile_pic", data.user.picture);
            // this.userResponseService.changePc(data.user.picture);
            // this.userResponseService.setTransactions(data);
            // console.log('Till here');
            if(localStorage.getItem('role') == 'admin' || localStorage.getItem('role') == 'subAdmin')
            {
              this.router.navigate(['/admin/dashboard']);
            }
            else{
              // console.log('in else case');
              this.isLoading=true;
              // console.log(this.isLoading);
              
              this.error = "User Unauthorized";
              // console.log(this.error, "first");
            }
          }
          else if(data.message == 'user blocked'){
            swal({
              type: 'error',
              text: data.message.toUpperCase(),
              timer:2000
            })
            this.router.navigate(['/forget_password'])
          }
          else if(data.message == 'User Already logged In.'){
            swal({
              type: 'error',
              text: data.message.toUpperCase(),
              timer:2000
            })
            this.router.navigate(['/forget_password'])
          }

          if(data.isActive == false){
            this.isLoading=true;
            this.error=data.message;
            // console.log(this.error, "in second");
          }
        },
        error => {
          console.log(error);
          let err = error.error;
          this.isLoading=true;
          this.error=err.message;
          // console.log(error);
     //     this.router.navigate(['/admin/dashboard']);
        }
      )
    }

  }

  // public otpSubmit(values:any):void{
  //   if (this.otpForm.valid){
  //     let payload={'email':this.emailId, 'otp':values.otp};
  //     this.userService.submitOTP(payload).subscribe(
  //       data => {
  //         console.log(data);
  //         this.router.navigate(['/dashboard']);

  //       }, error => {
  //         console.log(error);
  //         this.router.navigate(['/dashboard']);
  //       }
  //     )
  //   }
  // }

  // resendOTP() {
  //   if(this.emailId) {
  //     this.userService.resendOTP(this.emailId).subscribe( 
  //       data => {
  //         console.log(data)
  //       },
  //       error => {
  //       }
  //   )
  //   }
  // }

  public forgotPassword(){
   
    this.router.navigate(['forget_password'])

    // this.userService.forgotPassword().subscribe(
    //   (data:any) => {
    //     // console.log(data);
    //     this.showSuccess(data.message);
    //   },
    //   error => {
    //     // console.log(error);
    //   }
    // )
    // this.login = false;
    // // this.OTP = false;
    // this.fpsw = true;
  }

  // public fpSubmit(values:any):void{
  //   if(this.fpForm.valid){
  //     let payload = {
  //       'email':values.email,
  //       'phrase':values.key,
  //       'password':values.passwords.password,
  //       'confirmPassword':values.passwords.repeatPassword
  //     }
  //     this.userService.forgotPassword(payload).subscribe(
  //       (data:any) =>{
  //         console.log('Entered');
  //         this.fpsw=false;
  //         this.login=true;
  //         this.showSuccess(data.message);
  //       },
  //       error =>{
  //         console.log(error.error.message);
  //         console.log(error);
  //         this.fpForm.reset();
  //         this.showError(error.error.message);
  //       }
  //     )
  //   }
  // }

  public sitekey: string = "6LcJRmIUAAAAAPvssnCJCcXBYOY9q0vlxDf-8drd";
  public theme: string = "light";
  setVerifiedCaptcha(data){
    if(data == true) {
      this.isCaptcha = true;
    }
  }

  // rpSubmit(value){
  //   if(this.rpForm.valid){
  //     this.userService.resetPassword(value.resetPassword).subscribe(
  //       data => {
  //         this.login = true;
  //       },
  //       error => {
  //         console.log(error);
  //         this.login=true;
  //       }
  //     )
  //   }
  // }

  // close(){
  //   this.login=true;
  //   this.OTP=false;
  //   this.fpsw=false;
  //   this.rpsw=false;
  //   this.form.reset();
  //   this.otpForm.reset();
  //   this.fpForm.reset();
  //   this.rpForm.reset();
  // }


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
