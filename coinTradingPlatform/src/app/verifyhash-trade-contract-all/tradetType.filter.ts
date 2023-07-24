import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'tradePipe',
})
@Injectable()
export class TradePipe implements PipeTransform {

    transform(items: any): any {
        var id=localStorage.getItem('id');
        if (!items) {
            return;
        }
        
        return ((id==items.receiver._id)?"BUY":"SELL");
    }
}
