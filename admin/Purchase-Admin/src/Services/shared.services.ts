import { Injectable, } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs';
import { Socket } from 'ng-socket-io';


@Injectable()
export class SharedService {

  public notifications = new Subject<any>();

  constructor(private socket: Socket) {

    
    this.socket.on('usernotification', (data: any) => {
      
      let value = 0;
      
      if (data.type == 'PURCHASE') {
        
        if (localStorage.getItem('sellNotify')) {
          value = parseInt(localStorage.getItem('sellNotify'));
        }
        ++value;
        
        this.updateNotification({ type: 'SELL', value: value })
  
        localStorage.setItem('sellNotify', JSON.stringify(value));
      }
  
      if (data.type == 'SELL') {
        
        if (localStorage.getItem('purchaseNotify')) {
          value = parseInt(localStorage.getItem('purchaseNotify'));
        }
        ++value;
        
        this.updateNotification({ type: 'PURCHASE', value: value })
  
        localStorage.setItem('purchaseNotify', JSON.stringify(value));
      }
  
      if ((data.type == 'CREATE_CONTRACT') || (data.type == 'CONTRACT_HISTORY')) {
        if (localStorage.getItem('contractNotify')) {
          value = parseInt(localStorage.getItem('contractNotify'));
        }
        ++value;
        // console.log('Value = ',value);
        this.updateNotification({ type: 'CREATE_CONTRACT', value: value })
  
        localStorage.setItem('contractNotify', JSON.stringify(value));
      }

      if ((data.type == 'PRIVATE_CONTRACT') || (data.type == 'PRIVATE_CONTRACT_HISTORY')) {
        if (localStorage.getItem('privateContractNotify')) {
          value = parseInt(localStorage.getItem('privateContractNotify'));
        }
        ++value;
        
        this.updateNotification({ type: 'PRIVATE_CONTRACT', value: value })
  
        localStorage.setItem('privateContractNotify', JSON.stringify(value));
      }
  
      if ((data.type == 'TRADE_ORDER') || (data.type == 'TRADE_ORDER_HISTORY')) {
        if (localStorage.getItem('tradeNotify')) {
          value = parseInt(localStorage.getItem('tradeNotify'));
        }
        ++value;
        // console.log('Value = ',value);
        this.updateNotification({ type: 'TRADE_ORDER', value: value })
  
        localStorage.setItem('tradeNotify', JSON.stringify(value));
      }
    });
  
  
  }

 
  updateNotification(value: any) {
    this.notifications.next(value);
  }

}