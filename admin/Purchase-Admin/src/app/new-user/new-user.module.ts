import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user.component';

@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        FormsModule,  
    ],
    declarations:[
        NewUserComponent
    ]
})

export class NewUserModule {}