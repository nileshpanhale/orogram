import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { FileUploader } from 'ng2-file-upload';

import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { UserService } from 'services/user.service';
import { CheckSecretKeyService } from 'services/checksecretKey.service';
import { AuthenticationService } from '../core/authentication/authentication.service';
import swal from 'sweetalert2';
import urls from '../../configs/urls';
import baseUrl from '../../../BaseUrl';


@Component({
  selector: 'app-editProfile',
  templateUrl: './editProfile.component.html',
  styleUrls: ['./editProfile.component.scss']
})
export class EditProfileComponent implements OnInit {
  selectedFile: File;
  onFileChanged(event:any) {
    const file = event.target.files[0]
  }
  getusersecretkeyValue=false;
  submitted = false;
  error = '';
  profileForm: FormGroup;

  public firstName:AbstractControl;
  public lastName:AbstractControl;
  public mobile:AbstractControl;

  myFile: File;
  selectedFileList: any

  // public uploader: any;
  // public cnt = 0;
  // public filesUpName: Array<string> = [];
  // public URL = baseUrl + '/transactionscontract/profileImageUploadMultiple';


  txtName = '';
  profileBaseUrl = '';

  constructor(private router: Router, private formBuilder: FormBuilder,private dataService: DataService, 
    public userService:UserService, private checkSecretKeyService:CheckSecretKeyService, 
    private authenticationService:AuthenticationService ) {
    // console.log(this.userService.user, "userssss");
    
      if(!this.userService.user.hasOwnProperty('firstName'))
      {
        this.router.navigate(['/profile']);
      }   
      this.profileForm = this.formBuilder.group({
        'firstName': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(/^[A-Z]+$/i)]) ],
        'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(/^[A-Z]+$/i)]) ],
        email: localStorage.getItem('email'),
        'mobile': ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)]) ],    //  /^\d{8,15}$/
      
      });

      this.firstName = this.profileForm.controls['firstName'];
      this.lastName = this.profileForm.controls['lastName'];
      this.mobile = this.profileForm.controls['mobile'];

      this.profileBaseUrl = urls.baseImageUrl;

      // image upload code ----------------------------
      // this.uploader = new FileUploader({ url: this.URL, itemAlias: 'files' });

      // this.uploader.onBeforeUploadItem = (item: any) => {
      //     item.withCredentials = false;
      // }
      // this.uploader.onAfterAddingFile = (item: any) => {
      //     item.withCredentials = false;
      // };

      // this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      //     // console.log("hitting submit OUT", item, status,response);
      //     this.cnt++;
      //     this.filesUpName.push(JSON.parse(response)[0].path)
      //     if (this.uploader.queue.length == this.cnt) {
      //         // sending other data to server -----------------------
      //         console.log("hitting submit IN");
      //         // this.submit(this.formValue);
      //         this.userService.user['documents'].push(this.filesUpName);
      //         this.cnt = 0;
      //     }
      // }
  } 

  ngOnInit() {
    this.profileForm.patchValue({
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      mobile: localStorage.getItem('mobile'),
    });
    // this.userService.user['picture']  = '';
    // this.profileForm.patch.email= localStorage.getItem('email');
    
  }  
  // get f() {  return this.profileForm.controls; }

	submitForm() {
    // this.error = [];  
    // console.log('in submit');
    
    this.submitted = true; 
    
		if(this.profileForm.valid){
			this.dataService.userprofileUpdate(this.profileForm.value).subscribe(
				(result:any) => {
          // console.log("result",result);
          this.showSuccess(result.message);
				},
				error => {
          this.error = 'Some error occurred, Please try again in later';
          this.showError(error.error.message);
				}
				)
    }
		
  }

  deactivateaccount() { 
      let deactive = JSON.parse(localStorage.getItem('credentials'));
      // console.log(deactive);
      
      this.dataService.userdelete(deactive.user._id).subscribe(
				(result:any) => {
          // this.showSuccess(result.message)
         // console.log("result",result)
				this.authenticationService.setCredentials();
        this.router.navigate(['/home'],{ replaceUrl: true });	},
				error => {
          this.error = 'Some error occurred, Please try again in later';
          // console.log(error);
          // this.showError(error.error.message);
				}
				)
  }

  // Profile Pic Upload
  onFileChange(event:any) {    
    this.myFile = event.target.files[0];
    this.uploadFile();
  }
  uploadFile() {
    const formData = new FormData();
    formData.append('profileImage', this.myFile, this.myFile.name);
    this.dataService.imageupload(formData).subscribe( res => {
      // console.log(res, "res from server");
      this.userService.user['picture']  = res['imageUrl'];
    }, (error) => {
      // console.log(error, "error from server");
    });
  }

  // Documents upload
  onDocChange(event:any) { 
    // console.log("11111111", event.target.files);
    this.selectedFileList = event.target.files;
    for (let i = 0; i < this.selectedFileList.length; i++) {
      this.uploadDoc(i, this.selectedFileList[i]);
    }
  }
  uploadDoc(i:number, file:File ) {
      // console.log("2222", this.selectedFileList);
      const formData = new FormData();
      formData.append('doc', this.selectedFileList[i], this.selectedFileList[i].name);
      this.dataService.docUpload(formData).subscribe( res => {
        console.log(res, "res from server");
        this.showSuccess("Document Uploaded Successfully");
      }, (error) => {         
        console.log(error, "error from server");
        this.showError("Failed to upload document. Please try again.")
      });
  }

  showSuccess(data:string){
    swal({
      type: 'success',
      text: data,
      timer:2000
    })
  }

  showError(data:string){
    swal({
      type: 'error',
      text: data,
      timer:2000
    })
  }

}
