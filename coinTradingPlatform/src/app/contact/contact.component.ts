import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit {
  submitForm: FormGroup;
  submitted = false;
  error = '';

  constructor(  private formBuilder: FormBuilder,private dataService: DataService ) { 
  this.submitForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.compose([Validators.required, Validators.min(3), Validators.email],) ],
    enquery: ['']
});
    }

  ngOnInit() {

  }
  get f() {  return this.submitForm.controls; }

  onSubmit() {
    this.submitted = true;  
    if(!this.submitForm || !this.submitForm.value || this.submitForm.value.email.length == 0 ) {
			this.error = 'No qnquiry';
		}
    if(this.error.length == 0) { 
    this.dataService.enquiry(this.submitForm.value).subscribe(
      (result:any) => {
        //  console.log("result",result)
					if(result) {
           swal("Enquiry Sent Successfully", "Thanks for Enquiry", "success");
           this.submitForm.reset();
          } else {
						this.error = result.error;
					}
				},
				error => {
          if(error.status == 201) {
           swal("Enquiry Sent Successfully", "Thanks for Enquiry", "success");
         } else {
            // console.log('error', error);
            swal("Some errors occurred, Please try again later");
               this.error = 'Some errors occurred, Please try again in later';
           
         }
        });
      }
      }
    }