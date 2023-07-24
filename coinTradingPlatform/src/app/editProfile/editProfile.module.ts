import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { EditProfileRoutingModule } from './editProfile-routing.module';
import { EditProfileComponent } from './editProfile.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    EditProfileRoutingModule,
    FormsModule,ReactiveFormsModule
  ],
  declarations: [
    EditProfileComponent
  ]
})
export class EditProfileModule { }
