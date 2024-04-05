import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ServicesRoutingModule
  ],
  declarations: [
    ServicesComponent
  ]
})
export class ServicesModule {


  constructor() { }

  ngOnInit() {

  var modal = document.getElementById('id01');
                
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}
 }
