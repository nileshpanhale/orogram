import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import countrycodes from './countrycodes';
import { DataService } from '../../services/data.service';
import { UserService } from 'services/user.service';
import { environment } from '@env/environment';
import { EqualPasswordsValidator } from './equalPasswordValidator';
import swal from 'sweetalert2';


import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  version: string = environment.version;
  //error: string;
  errors = '';
  signupForm: FormGroup;
  isLoading = false;
  submitted = false;
  public firstName : AbstractControl;
  public lastName : AbstractControl;
  public mobile : AbstractControl;
  public email : AbstractControl;
  public password : AbstractControl;
  public passwords:FormGroup;
  public confirmPassword : AbstractControl;
  public isChecked:boolean=true;
  public verifyMobile:boolean=false;
  public verifymobileNochkbox:boolean=false;
  private error:any = [];
  public isCaptch:boolean = true;

  public countrycode:AbstractControl;
  collection=countrycodes;


  constructor(private router: Router,
              private formBuilder: FormBuilder,private dataService: DataService ,
              private i18nService: I18nService,private userService:UserService,
              private authenticationService: AuthenticationService) {

  this.signupForm = formBuilder.group({
    'firstName': ['',  ],
    'lastName': ['',  ],
    'mobile': ['', Validators.compose([ Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(15)]) ],
    //'email': ['', Validators.required, Validators.minLength(3)],
    'email': ['', Validators.compose([ Validators.required, Validators.minLength(3)]) ],
    'countrycode':['', Validators.compose([Validators.required])],
    'passwords' : formBuilder.group({
    'password': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]) ],
    'confirmPassword': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]) ]},
    {validator: EqualPasswordsValidator.validate('password', 'confirmPassword')
    })
  });

  this.firstName = this.signupForm.controls['firstName'];
  this.lastName = this.signupForm.controls['lastName'];
  this.mobile = this.signupForm.controls['mobile'];
  this.countrycode = this.signupForm.controls['countrycode'];
  this.email = this.signupForm.controls['email'];
  this.passwords = <FormGroup> this.signupForm.controls['passwords'];
  this.password = this.passwords.controls['password'];
  this.confirmPassword = this.passwords.controls['confirmPassword'];
  }

  public resolved(captchaResponse: string) {

    this.isCaptch = false;
   
  }

  ngOnInit() { }
  get f() {  return this.signupForm.controls; }
  // signup() {
  //   this.isLoading = true;
  //   this.dataService.signup(this.signupForm.value)
  //     .pipe(finalize(() => {
  //       this.signupForm.markAsPristine();
  //       this.isLoading = false;
  //     }))
  //     .subscribe(credentials => {
  //       log.debug(`demo successfully logged in`);
  //       this.router.navigate(['/otp'],{ replaceUrl: true });
  //     }, error => {
  //       log.debug(`Login error: ${error}`);
  //       this.error = error;
  //     });
  // }
  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  terms(e:any){
    this.isChecked=!this.isChecked;
  }

  submitForm(values:any){
    console.log('In submitForm');
    
    if(this.signupForm.valid){
      let payload = {
        'firstName':values.firstName,
        'lastName':values.lastName,
        'email':values.email,
        'mobile':values.countrycode+" "+values.mobile,
        'password':values.passwords.password,
        'platform':'cryptoTrade',
      } 
      //alert(payload.mobile);
      this.dataService.signup(payload).subscribe(
        (data:any) => {
          console.log(data);
          this.userService.setusersecretkeyhash(data.phrase)
          // if(this.verifyMobile){
          //   this.dataService.generatOtp({'email':values.email}).subscribe(
          //     (data:any) => {
          //       console.log('otp',data);
          //     },
          //     (error:any) => {
          //       console.log('otp error',error);
          //     }
          //   )
          //   this.router.navigate(['/otp']);
          // }
          // else{
            this.router.navigate(['/success']);
          // }
        },
        error => {
          console.log(error);
          if(error.error.code == 409){
            swal({
              type:'error',
              text:'User Already Exists',
              timer:2000
            })
          }
        }
      )
    }
  }

  verify(){
    this.verifyMobile = !this.verifyMobile
  }

// 	submitForm() {
//     this.error = [];  
//     this.submitted = true; 
//     this.error = [];   
// 		const { firstName, lastName, mobile, email, password, confirmPassword, acceptedTerms ,verifymobileNochkbox } = this.signupForm.value;
// 		console.log('register', this.signupForm.value, acceptedTerms ,verifymobileNochkbox);
		
// 		const mobRegex = new RegExp(/^\+?\d{10}$/);
// 		const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
// 		const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

// 		if(!firstName || firstName.length < 2) {
// 			this.error.push('first name should have atleast 2 characters');
// 		}
// 		if(!lastName || lastName.length < 2) {
// 			this.error.push('last name should have atleast 2 characters');
// 		}
// 		if(!mobile || mobile.length == 0) {
// 			this.error.push('mobile number required');
// 		}
// 		if(!mobRegex.test(mobile)) {
// 			this.error.push('mobile number can only contain numbers or +');
// 		}
// 		if(!email || email.length == 0) {
// 			this.error.push('email required');
// 		}
// 		if(!emailRegex.test(email)) {
// 			this.error.push('email not valid');
// 		}
// 		if(!password || password.length == 0) {
// 			this.error.push('password requires');
// 		}
// 		if(!passwordRegex.test(password)) {
// 			this.error.push('password should have minimum eight characters, at least one letter, one number and one special character ');
// 		}
// 		if(confirmPassword != password) {
// 			this.error.push('confirm password not equal to password');
// 		}
// 		if(!acceptedTerms) {
// 			this.error.push('Please accept terms and conditions');
//     }
  
//     this.signupForm.value['platform'] = 'coinPurchase'; 
//     console.log("this.error.length" ,this.error.length)
// if(this.error.length == 0) { 
// console.log("valid");
// 	this.dataService.register(this.signupForm.value).subscribe(
// 				(result:any) => {
//           console.log('result', result);
          
//           if(verifymobileNochkbox == true )
//           {
//             console.log("verify mobile checked" ,verifymobileNochkbox == true )
           
//          this.router.navigate(['/otp'],{ replaceUrl: true });

//           }
//           else {
//             console.log("verify mobile no is not checked" ,verifymobileNochkbox )
//             if(result && result.user.id.length > 0) {
//               this.userService.setusersecretkeyhash(result.user.email)
//               this.router.navigate(['/success'],{ replaceUrl: true });
//             } else if(result && result.error) {
// 						this.error.push(result.error);
// 					} else {
// 						this.error.push('Some error occurred, Please try again later');
// 					}
//           }
					
// 				},
// 		error => {
// 					this.error.push('Some error occurred, Please try again later');
// 				}
// 			)

// 	}
// }
}
