import { Component, OnInit } from "@angular/core";
import { UserService } from "../../Services/user.service";
import { UserResponseService } from "../../Services/userResponse.service";
import { last } from "rxjs/operators";
import { EqualPasswordsValidator } from "../theme/equalPasswordValidator";
import { EmailValidator } from "../theme/emailValidator";
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  Form,
} from "@angular/forms";
import { COMMON_DEPRECATED_DIRECTIVES } from "@angular/common/src/directives";
import swal from "sweetalert2";
import urls from "../../configs/urls";

@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.css"],
})
export class AccountSettingsComponent implements OnInit {
  public form: FormGroup;
  public email: AbstractControl;
  public formPassword: FormGroup;
  public passwords: FormGroup;
  public originalPassword: AbstractControl;
  public password: AbstractControl;
  public repeatPassword: AbstractControl;
  public emailId: string;
  public role: string;
  changedEmaildiv = false;
  changedEmailres = false;
  Changepasswddiv = false;
  public fileName: any;
  public lastChanged: any;
  public accountForm: FormGroup;
  public btc: AbstractControl;
  public accountName: AbstractControl;
  public accountNumber: AbstractControl;
  public ifsc: AbstractControl;
  public swift: AbstractControl;
  public accountAddress: AbstractControl;
  picture = localStorage.getItem("picture");
  myFile: File;
  txtName = "";
  profileBaseUrl = "";

  constructor(
    public userService: UserService,
    fb: FormBuilder,
    fb2: FormBuilder,
    public userResponseService: UserResponseService
  ) {
    this.form = fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
          EmailValidator.validate,
        ]),
      ],
    });

    this.formPassword = fb.group({
      originalPassword: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ]),
      ],
      passwords: fb2.group(
        {
          password: [
            "",
            Validators.compose([
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(30),
            ]),
          ],
          repeatPassword: [
            "",
            Validators.compose([
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(30),
            ]),
          ],
        },
        {
          validator: EqualPasswordsValidator.validate(
            "password",
            "repeatPassword"
          ),
        }
      ),
    });

    this.accountForm = fb.group({
      // btc: ["", Validators.compose([Validators.required])],
      accountName: ["", Validators.compose([Validators.required])],
      // accountNumber: ["", Validators.compose([Validators.required])],
      // ifsc: ["", Validators.compose([Validators.required])],
      // swift: ["", Validators.compose([Validators.required])],
      // accountAddress: ["", Validators.compose([Validators.required])],
    });

    this.email = this.form.controls["email"];

    this.originalPassword = this.formPassword.controls["originalPassword"];
    this.passwords = <FormGroup>this.formPassword.controls["passwords"];
    this.password = this.passwords.controls["password"];
    this.repeatPassword = this.passwords.controls["repeatPassword"];
    this.profileBaseUrl = urls.baseImageUrl;
    // this.btc = this.accountForm.controls["btc"];
    this.accountName = this.accountForm.controls["accountName"];
    // this.accountNumber = this.accountForm.controls["accountNumber"];
    // this.ifsc = this.accountForm.controls["ifsc"];
    // this.swift = this.accountForm.controls["swift"];
    // this.accountAddress = this.accountForm.controls["accountAddress"];
  }

  ngOnInit() {
    this.emailId = localStorage.getItem("email");
    console.log("what is email id: ", this.emailId);
    this.lastChanged = localStorage.getItem("lastUpdatedPassword");
    // // console.log(this.lastChanged.split("T")[0]);
    this.role = localStorage.getItem("role");
    console.log("what is role : ", this.role);

    this.userService.getAccountInfo().subscribe(
      (data: any) => {
        // console.log(data);
        this.accountForm.patchValue({
          // btc: data.btcWalletAddress,
          accountName: data.accountName,
          // accountNumber: data.accountNumber,
          // ifsc: data.accountIfsc,
          // swift: data.accountSwift,
          // accountAddress: data.accountAddress,
        });
        console.log("Admin account details : ", this.accountName);
      },
      (error) => {
        // // console.log(error);
      }
    );
  }

  changeEmail() {
    this.changedEmaildiv = !this.changedEmaildiv;
  }

  onSubmitChangepasswd() {
    this.Changepasswddiv = !this.Changepasswddiv;
  }

  onSubmit(values: any): void {
    this.changedEmaildiv = false;
    if (this.form.valid) {
      let payload = {
        email: values.email,
      };
      this.userService.changeEmail(payload).subscribe(
        (data) => {
          // console.log(data);
          localStorage.setItem("email", values.email);
          this.emailId = localStorage.getItem("email");
          this.form.reset();
        },
        (error) => {
          // console.log(error);
        }
      );
    }

    // // console.log("changedEmail",this.changedEmail,"&&& Email",this.Email)

    //var a===localStorage.getItem("key")||this.userService.getUserEmail
    // var data = {
    //     "query": {"email":this.Email}, //meed to cahne with email
    //     "update":this.changedEmail
    //   }

    //    this.userService.userprofileUpdate(data).subscribe(
    //       data => {
    //         if(data) {
    //       this.changedEmailres=true;
    //         }
    //       },
    //       error => {
    //         this.changedEmailres=false;
    //         // console.log(error);
    //       }
    //     )
  }

  onConfirm(values: any) {
    this.Changepasswddiv = false;
    if (this.formPassword.valid) {
      let payload = {
        oldPassword: values.originalPassword,
        password: values.passwords.password,
        confirmPassword: values.passwords.repeatPassword,
      };
      this.userService.updatePassword(payload).subscribe(
        (data: any) => {
          let userData = {
            email: localStorage.getItem("email"),
            password: values.passwords.password,
          };
          // console.log(data);
          this.showSuccess(data.message);

          this.userService.login(userData).subscribe(
            (data: any) => {
              localStorage.setItem(
                "lastUpdatedPassword",
                data.user.lastUpdatedPassword
              );
            },
            (error) => {
              // console.log(error);
            }
          );
          this.formPassword.reset();
        },
        (error) => {
          this.showError(error.error.message);
          this.changedEmailres = false;
          // console.log(error);
        }
      );
    }
  }

  onFileChange(event: any) {
    this.myFile = event.target.files[0];
    this.uploadFile();
  }
  uploadFile() {
    const formData = new FormData();
    formData.append("profileImage", this.myFile, this.myFile.name);
    this.userService.uploadProfilePic(formData).subscribe(
      (res: any) => {
        // console.log(res, "res from server");

        localStorage.setItem("picture", res.imageUrl);
        this.picture = localStorage.getItem("picture");
        // this.profileBaseUrl = urls.baseImageUrl + res['imageUrl'];
        this.userResponseService.user["picture"] = res["imageUrl"];
      },
      (error) => {
        // console.log(error, "error from server");
      }
    );
  }

  onSubmitAccount(value) {
    // console.log(value);
    let payload = {
      btcWalletAddress: value.btc,
      accountName: value.accountName,
      accountNumber: value.accountNumber,
      accountIfsc: value.ifsc,
      accountSwift: value.swift,
      accountAddress: value.accountAddress,
    };
    this.userService.accountInfo(payload).subscribe(
      (data: any) => {
        // console.log(data);
        this.showSuccess(data.message);
      },
      (error) => {
        // console.log(error);
      }
    );
  }

  showSuccess(data: string) {
    swal({
      type: "success",
      text: data,
      timer: 2000,
    });
  }

  showError(data: string) {
    swal({
      type: "error",
      text: data,
      timer: 2000,
    });
  }
}
