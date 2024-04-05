import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filterPrice',
})
@Injectable()
export class FilterPrice implements PipeTransform {
    transform(price: any, coins: any): any{
        if (!price) {
            return ;
        }
        let coin=parseFloat(coins);
        return (price / coin );
    }
}
