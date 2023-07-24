import { Component, OnInit } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator} from './emailValidation';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  public selectedValue:string="";
  public form:FormGroup;
  public email:AbstractControl;
  // public email
  public role='subAdmin';
  constructor(fb: FormBuilder, public userService : UserService, public router : Router) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required])],
    });

    this.email=this.form.controls['email']
   }

  ngOnInit() {
    if(localStorage.getItem('role') != 'admin'){
      this.router.navigate(['/admin/dashboard']);
    }
  }
  
  createUser(values){
    if(this.form.valid){
      let payloadData = {'role':this.role, 'email':values.email, 'platform':'admin'}
      this.userService.createUser(payloadData).subscribe(
        (data:any) => {
          console.log("111111", data);
          this.form.reset();
          this.showSuccess(data.message);
          // this.selectedValue="";
        },
        error => {
          let errorMessage = JSON.parse(error._body);
          // console.log(errorMessage.errors[0]);
          let some = errorMessage.errors[0];
          this.showError(some.messages);
        }
      )
    }
    else {
      console.log("invalid form", this.form.valid);
      
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
  // selectRole(){
  //   console.log(this.selectedValue);
  // }

}