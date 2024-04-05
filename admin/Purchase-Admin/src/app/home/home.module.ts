import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import {GoogleRecaptchaDirective} from './../directive/recaptcha'

@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        FormsModule,  
        // ReCaptchaModule
    ],
    declarations:[
        HomeComponent,
        GoogleRecaptchaDirective
    ]
})

export class HomeModule {}