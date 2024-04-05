import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerEmailFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, arrName:string, args?: any): any {
    if (!args) {
      return value;
    }
    args = args.toLowerCase();
    if(arrName == 'transaction'){
        return value.filter((val) => {
              
              let rVal = (val.receiverId.toLowerCase().includes(args)) || (val.type.toLowerCase().includes(args)) || (val.status.toLowerCase().includes(args)) 
              ||  (val.amount.toString().includes(args))
              return rVal;
        })
    }
    if(arrName == 'sendToken'){
        return value.filter((val) => {
            
              let rVal = (val.receiverAccount.toLowerCase().includes(args)) || (val.remarks.toLowerCase().includes(args)) || (val.type.toLowerCase().includes(args))         
              return rVal;
        })
    }
    if(arrName == 'userDetails'){
        return value.filter((val) => {
            
              let rVal = (val.userId.toLowerCase().includes(args)) || (val.account.address.toLowerCase().includes(args)) || (val.role.toLowerCase().includes(args))
              || (val.email.toLowerCase().includes(args))         
              return rVal;
        })
    }

  }

}