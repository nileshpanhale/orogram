import { Component, OnInit, DoCheck, ChangeDetectorRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserResponseService } from "../../Services/userResponse.service";
import { UserService } from "../../Services/user.service";
import { SharedService } from "Services/shared.services";

@Component({
  selector: "admin-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  public role: string;
  public sellNotification = 0;
  public purchaseNotification = 0;
  public contractNotification = 0;
  public privatecontractNotification = 0;
  public tradeNotification = 0;

  constructor(
    private cd: ChangeDetectorRef,
    public router: Router,
    public userService: UserService,
    public userResponseService: UserResponseService,
    public sharedService: SharedService
  ) {
    // this.sharedService.sendMessage("send message");
    this.sharedService.notifications.subscribe((res: any) => {
      // console.log("response of notification : ", res);
      if (res.type == "SELL") {
        this.sellNotification = res.value;
      }
      if (res.type == "PURCHASE") {
        this.purchaseNotification = res.value;
      }
      if (res.type == "CREATE_CONTRACT") {
        this.contractNotification = res.value;
      }
      if (res.type == "PRIVATE_CONTRACT") {
        this.privatecontractNotification = res.value;
      }
      if (res.type == "TRADE_ORDER") {
        this.tradeNotification = res.value;
      }
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    if (localStorage.getItem("purchaseNotify")) {
      this.purchaseNotification = parseInt(
        localStorage.getItem("purchaseNotify")
      );
    }

    if (localStorage.getItem("sellNotify")) {
      this.sellNotification = parseInt(localStorage.getItem("sellNotify"));
    }

    if (localStorage.getItem("contractNotify")) {
      this.sellNotification = parseInt(localStorage.getItem("contractNotify"));
    }

    if (localStorage.getItem("privateContractNotify")) {
      this.sellNotification = parseInt(
        localStorage.getItem("privateContractNotify")
      );
    }

    if (localStorage.getItem("tradeNotify")) {
      this.sellNotification = parseInt(localStorage.getItem("tradeNotify"));
    }

    this.role = localStorage.getItem("role");
  }

  logout() {
    let body = {
      token: localStorage.getItem("access_token"),
    };
    console.log("In Logout", body.token);
    localStorage.removeItem("access_token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("isActive");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("emailVerified");
    localStorage.removeItem("lastUpdatedPassword");
    localStorage.removeItem("id");
    localStorage.removeItem("picture");
    this.userService.logout(body).subscribe((data: any) => {
      console.log("In Logout");
      this.router.navigate(["/admin/home"]);
    });
    // this.router.navigate(['/admin/home']);
  }

  ngDoCheck() {
    // console.log('this.router.url:',this.router.url);
    if (this.router.url == "/admin") {
      this.router.navigate(["/admin/dashboard"]);
    }
  }
}
function msg(msg: any, any: any) {
  throw new Error("Function not implemented.");
}
