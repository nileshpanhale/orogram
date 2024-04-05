import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { DELEGATE_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Pipe({
    name: 'filterStatus',
})
@Injectable()
export class FilterStatus implements PipeTransform {
    transform(items:boolean): string {
        if (!items) {
            return("Deactive");
        }
        else
        {
            return("Active");
        }
    }
}

