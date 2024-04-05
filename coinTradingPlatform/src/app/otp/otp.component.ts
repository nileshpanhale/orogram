import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';

import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  version: string = environment.version;
  otp: FormGroup;
  submitted = false;
	private error = '';
  constructor(private router: Router,
    private formBuilder: FormBuilder,private dataService: DataService  ) {
     this.otp = this.formBuilder.group({
        otp: ['', Validators.compose([Validators.required, Validators.min(6), Validators.pattern(/^\+?\d{10}$/) ]) ],
   }); }

  ngOnInit() { }
  get f() {  return this.otp.controls; }
  submitOTPForm() {
    this.submitted = true; 
    if(!this.otp || !this.otp.value || this.otp.value.otp.length == 0 ) {
			this.error = 'OTP required';
		}
		if(this.error.length == 0) {
			this.dataService.verifyOtp(this.otp.value).subscribe(
				(result:any) => {
					if(result && result.message) {
          this.router.navigate(['/success'],{ replaceUrl: true });
					} else {
						this.error = result.error;
					}
				},
				error => {
					this.error = 'Some error occurred, Please try again in later';
				}
				)
		}


  }

}
