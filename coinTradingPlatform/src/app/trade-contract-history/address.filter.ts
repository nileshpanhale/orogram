import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'addressPipe',
})
@Injectable()
export class AddressPipe implements PipeTransform {

    transform(items: any): any[] {
        var id=localStorage.getItem('id');
        if (!items) {
            return;
        }
        
        return ((id==items.receiver._id)?items.sender.account.address:items.receiver.account.address);
    }
}
