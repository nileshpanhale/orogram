import { Component} from '@angular/core';
import { Socket } from 'ng-socket-io';


@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  
  constructor(){}

}
