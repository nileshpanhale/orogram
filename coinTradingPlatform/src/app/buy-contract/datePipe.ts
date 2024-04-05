import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'dateConvert',
})
@Injectable()
export class DatePipe implements PipeTransform {
    transform(dateName: any): any{
        console.log('date:',dateName);
        
        if (!dateName) {
            return ;
        }

        var d = new Date(dateName);
        let dt= d.toDateString();

        console.log("Conver Date",dt);
        
        return dt;
    }
}
