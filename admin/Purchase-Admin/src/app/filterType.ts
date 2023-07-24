import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filterUser',
})
@Injectable()
export class FilterUser implements PipeTransform {
    transform(items:string): string {
        if (!items) {
            return ;
        }
        if(items=="user")
        {
            return("Customer");
        }
        else{
            return("System");
        }
        
    }
}
