import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {

  public tabSet="tab1";
  public tabid:number;
  constructor() { }

  ngOnInit() {
    
  }

  
}
