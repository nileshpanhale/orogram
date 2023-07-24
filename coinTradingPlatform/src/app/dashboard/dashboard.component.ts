import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { SharedService } from 'services/shared.service';
import urls from '../../configs/urls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public name:string;
  public email:string;
  public id:string;
  public mobile:string;
  historyNotifications:any;
  profileBaseUrl = '';

  constructor(public datService : DataService, public userService:UserService, public sharedService : SharedService) { 
    this.sharedService.notification.subscribe((res:any) => {
      setTimeout(() => {
        if(localStorage.getItem('historyNotifications')){
          this.historyNotifications = JSON.parse(localStorage.getItem('historyNotifications'));
        }
      }, 1000)
    })

    if(localStorage.getItem('historyNotifications')){
      this.historyNotifications = JSON.parse(localStorage.getItem('historyNotifications'));
    }
  }

  ngOnInit() {
    this.datService.getUserProfile().subscribe(
      (data:any) => {
        this.userService.user = data;
        if(data.firstName || data.lastName){
          this.name = data.firstName + ' ' + data.lastName;
        }
        this.email = data.email;
        this.id = data.userId;
        this.mobile = data.mobile;
        this.profileBaseUrl = urls.baseImageUrl;
      },
      error => {
        // console.log(error);
      }
    )
  }

}
