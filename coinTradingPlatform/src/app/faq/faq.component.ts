import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import swal from 'sweetalert';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
 submitForm: FormGroup;
  submitted = false;
  error = '';
  constructor(  private formBuilder: FormBuilder,private dataService: DataService ) { 
    this.submitForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.min(3), Validators.email],) ],
      question: ['',Validators.required]
  });
      }

      ngOnInit() {
        var acc = document.getElementsByClassName("accordion");
        var i;
        
        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight){
              panel.style.maxHeight = null;
            } else {
              panel.style.maxHeight = panel.scrollHeight + "px";
            } 
          });
        }
      }
      get f() {  return this.submitForm.controls; }
    
      onSubmit() {
        this.submitted = true;  
        if(!this.submitForm || !this.submitForm.value || this.submitForm.value.email.length == 0 ) {
          this.error = 'No qnquiry';
        }
        if(this.error.length == 0) { 
        this.dataService.enquiry(this.submitForm.value).subscribe( 	(result:any) => {
            //  console.log("result",result)
              if(result && result.status == 200 ) {
               swal("Enquiry Sent Successfully", "Thanks for Enquiry", "success");
              } else {
                this.error = result.error;
              }
            },
            error => {
              // console.log('error', error);
              swal("Some errors occurred, Please try again in later");
               this.error = 'Some errors occurred, Please try again in later';
              });
          }
          }
        }