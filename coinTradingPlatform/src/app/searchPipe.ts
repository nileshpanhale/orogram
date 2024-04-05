import { includes } from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerEmailFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, amount:any, country: any, tradeType:any ): any {
    // if (!args) {
    //   return value;
    // }
    // args = args.toLowerCase();
    console.log('In pipe');
    
    console.log('ARGS:',value);

      
        return value.filter((val:any) => {
                console.log('Coin:', val.coins);
           
              let rVal = (country ? val.country.toLowerCase() === country.toLowerCase() : true)   &&  (amount ? val.coins === amount : true) && (tradeType ? val.tradeType.toLowerCase() === tradeType.toLowerCase(): true)
              return rVal;
        })
    

    

  }

}