import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service'
import { AuthenticationService } from '../core/authentication/authentication.service';

@Component({
  selector: 'app-check-auth',
  templateUrl: './check-auth.component.html',
  styleUrls: ['./check-auth.component.scss']
})
export class CheckAuthComponent implements OnInit {

  public googleCode:number;
  constructor(public router:Router, public dataService:DataService, public userService:UserService, public authenticationService:AuthenticationService) { }

  ngOnInit() {
  }

  navigate(){
    // console.log("In navigate",this.googleCode);
    
    let payload = {
      'email':localStorage.getItem('email'),
      'code':this.googleCode
    }
    this.dataService.checkCode(payload).subscribe(
      (data:any) => {
        console.log("111111", data);
        this.authenticationService.setCredentials(data);
        console.log("2222222")
        this.userService.user = data.user;
        console.log("333333")
        this.router.navigate(['/profile']);
      },
      (error:any) => {
        console.log("ERROR----------", error);
      }
    )
  }
}
