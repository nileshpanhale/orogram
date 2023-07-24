import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service'
import swal from 'sweetalert2';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string = environment.version;
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  isCaptch = true;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService,
              public userService:UserService) {
    this.createForm();
  } 

  public resolved(captchaResponse: string) {

    this.isCaptch = false;
   
  }

  ngOnInit() { }

 

  async login() {
   
    // this.router.navigate(['/'], { replaceUrl: true });
    this.authenticationService.login(this.loginForm.value).subscribe(
      (res: any)=>{
        console.log("LoginLog::",res)
        // console.log(this.loginForm.value.email);
        if(res.message == 'user blocked'){
          swal({
            type: 'error',
            text: res.message.toUpperCase(),
            timer:2000
          })
          this.router.navigate(['/forgot'])
        }
        if(res.message == 'User Already logged In.'){
          swal({
            type: 'error',
            text: res.message.toUpperCase(),
            timer:2000
          })
          this.router.navigate(['/forgot'])
        }
        if(!res.isActive){
          // console.log('In first');
          this.isLoading = true;
          this.error=res.message;
        }
       
          if(res.token){
            // console.log('In second');
            this.authenticationService.setCredentials(res);
            this.userService.user = res.user;
            // this.userService.setUserCredentials(res);
            this.router.navigate(['/googleAuth']);
          } 
          if(res.googleAuth == true) {
            // console.log('In third');
            localStorage.setItem('email',this.loginForm.value.email)
            this.router.navigate(['/checkAuth']);
          }
        
        // if(res && res.token) {
        //   console.log('response', res);
        //   this.authenticationService.setCredentials(res);
        //   this.userService.user = res.user;
        //   // this.userService.setUserCredentials(res);
        //   this.router.navigate(['/trade']);
        // } 
      },
      (err: any) => {
        this.isLoading = true;
        
          this.error = err.error.message;
          // console.log('Error Value:',this.error);
      }
      )
      // .then((credentials:any) => {
      //   log.debug(`successfully logged in`);
      //   console.log('result', credentials);
      //   if(credentials && credentials.user) {
      //     // this.router.navigate(['/'], { replaceUrl: true });
      //   } else {
      //     this.error = 'some error occurred';
      //   }
      // }, (error:any) => {
      //   log.debug(`Login error: ${error}`);
      //   this.error = error;
      // });
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required],
      remember: true
    });
  }

}
