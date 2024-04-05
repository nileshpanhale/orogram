import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';

import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  quote: string;
  isLoading: boolean;
  public btcPrice:any
  // public btcPriceeur  = ""
  public bitoroPrice:any;
  public bitorobtc:any
  

  constructor(private quoteService: QuoteService,  public dataService : DataService,private router:Router ) { }

  ngOnInit() {
    this.isLoading = true;
    this.quoteService.getRandomQuote({ category: 'dev' })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((quote: string) => { this.quote = quote; });

      //getting BTC price here ---------------------

      // this.dataService.getBTCPrice().subscribe(
      //   (data:any) => {
      //     console.log("API BTC:: ",data);
  
      //     //Converting ounce to gram = data.Mid/28.3495
      //     this.btcPrice =  data.bpi.USD.rate;
      //     this.btcPriceeur =  data.bpi.EUR.rate;
          
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // )
    //   this.httpClient.disableApiPrefix().get('https://api.coindesk.com/v1/bpi/currentprice.json').subscribe((data:any)=>{
    //     console.log("API BTC:: ",data);

    //     
    // });
    
    //getting Gold price here ---------------------

    this.dataService.getGoldPrice().subscribe(
      (data:any) => {
        console.log("APIGold:: ",data);

        //Converting ounce to gram = data.Mid/28.3495
      // this.bitoroPrice =  Math.round((parseInt(data.Mid)/28.3495) * 100) / 100;
      this.bitoroPrice =  data.goldprice;
      this.btcPrice = data.btcprice;
      this.bitorobtc = data.bitorobtc;
        
      },
      error => {
        console.log(error);
      }
    )
   
      
  


       // Get the modal
       var modal = document.getElementById('id01');
                
       // When the user clicks anywhere outside of the modal, close it
       window.onclick = function(event) {
           if (event.target == modal) {
               modal.style.display = "none";
           }
       }
  }
}
