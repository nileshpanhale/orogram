import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.scss']
})
export class TwoFactorComponent implements OnInit {

  public tabSet="tab1";
  public tabid:number;
  public key='';
  public qrCode='';
  constructor( public dataService : DataService, public router:Router) { }

  ngOnInit() {
  }

  setAuth(){
    if(this.key){
      // console.log("Value Present");
      
    }
    else{      
      // console.log("In else condition");

       this.dataService.enableGoogleAuth().subscribe( (res:any) => {
        // console.log(res);
        this.key = res['key'];
         this.qrCode = res['qrCode'].replace('\\','/');  

      })
      // console.log("Value Updated");
      
    }
  }

  change(value:any){
    switch (value){

      case 1:
      
      this.tabSet = "tab1";
      break;
      
      
      case 2:
      
      this.tabSet = "tab2";
      // console.log("In tab 2")
      this.setAuth();
      // document.getElementById("qr_code").innerHTML = "Some Value";
     
      break;
      
      case 3:
      
      this.tabSet = "tab3";
      this.setAuth();
      
      break;
      
      }

  }

  myFunction()
  {
    document.getElementById("demo").innerHTML = "Paragraph changed!";
  }
  
  navigate(){
    this.router.navigate(['/profile']);
  }

}
