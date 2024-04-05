import { Component, OnInit } from '@angular/core';
import { UserService } from 'services/user.service';
// declare var jsPDF: any;
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { environment } from '@env/environment';
import { CheckSecretKeyService } from 'services/checksecretKey.service';

@Component({
  selector: 'app-registeredSuccessfully',
  templateUrl: './registeredSuccessfully.component.html',
  styleUrls: ['./registeredSuccessfully.component.scss']
})
export class RegisteredSuccessfullyComponent implements OnInit {
  secretkeyphrase='';
  version: string = environment.version;

  constructor(private userService:UserService,private checkSecretKeyService:CheckSecretKeyService) { 
    this.secretkeyphrase=this.userService.getusersecretkeyhash()
    // this.checkSecretKeyService.setusersecretkeyValue(true)
  }

  ngOnInit(){ 
  }

  downloadpdf(){
    console.log("1111111")
    var columns = ["Secret"];
    var rows = [[this.secretkeyphrase]];
    console.log("22222222")
    this.secretkeyphrase = this.secretkeyphrase ? this.secretkeyphrase : "test phrase dfhsujhfiushf  sfdeiyhusedfhsdjfbhsdfc fdshgiufhsiufhsdfhsdjff fghsiuefghsdiufhsdjsd dsfghiusdfghsdfbsdfc sdfgsdfbsdjfbsdjbfsdfghuisdjfbcsdf fcgsduifgsdjfnbjsdbfjksdbf"
    var doc = new jsPDF();

    var splitTitle = doc.splitTextToSize(this.secretkeyphrase, 180);
doc.text(15, 20, splitTitle);

    // doc.text(this.secretkeyphrase, 10, 10, 'center')

    console.log("333333333")
    // doc.autoTable(columns,rows);
    // doc.autoTable({
    //   head: columns,
    //   body: rows,
    // })
    doc.save('Secret-phrase.pdf');
  }
}
