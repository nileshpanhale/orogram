import { PrivacyModule } from './privacy/privacy.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { ProfileViewModule } from './profileView/profileView.module';
import { OtpModule } from './otp/otp.module';
import { EditProfileModule } from './editProfile/editProfile.module';
import { RegisteredSuccessfullyModule } from './registeredSuccessfully/registeredSuccessfully.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactModule } from './contact/contact.module';
import { TermsModule } from './terms/terms.module';
import { SignupModule } from './signup/signup.module';
import { FaqModule } from './faq/faq.module';
import { TradeContractHistoryAllModule } from './open-trade-contract-all/open-trade-contract-history.module';
import { ServicesModule } from './services/services.module';
import { SuccessfullpaymentModule } from './successfullpayment/successfullpayment.module';
import { SuccessresetpasswdModule } from './successresetpasswd/successresetpasswd.module';
import { ChangePasswordModule } from './change-password/change-password.module';

import { FileUploadModule } from 'ng2-file-upload';
import { SearchPipe } from './searchPipe';

// import { PrivacyComponent } from './privacy/privacy.component';
// import { PurchasecryptoComponent } from './purchasecrypto/purchasecrypto.component';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { CheckSecretKeyService } from '../services/checksecretKey.service';
import { PurchasecryptoModule } from './purchasecrypto/purchasecrypto.module';
import { SellcryptoAdminModule } from './sell-crypto-admin/sell-crypto-admin.module'
import { TradeHistoryModule } from './trade-history/trade-history.module';
import { TradeContractHistoryModule } from './trade-contract-history/trade-contract-history.module';

import { TradeContractHistoryClosedModule } from './trade-contract-history-closed/trade-contract-history-closed.module';
import { BuyCryptoModule } from './buy-crypto/buy-crypto.module';
import { TransactionModule } from './transaction/transaction.module';
import { BuyContractModule } from './buy-contract/buy-contract.module';
import { BuyContractClosedModule } from './buy-contract-closed/buy-contract-closed.module';
import { SellContractClosedModule } from './sell-contract-closed/sell-contract-closed.module';
import { SellCryptoModule } from './sell-crypto/sell-crypto.module';
import { SellContractModule } from './sell-contract/sell-contract.module';
import { SendTokensModule } from './send-tokens/send-tokens.module';
import { CreateOrderModule } from './create/create.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ManageAccountModule } from './manage-account/manage-account.module';
import { ForgotPasswdModule } from './forgot-password/forgot-password.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { TwoFactorAuthModule } from './two-factor/two-factor.module';
import { WalletModule } from './wallet/wallet.module';
import { CheckAuthModule } from './check-auth/check-auth.module';
import { CreateNewOrderModule } from './create-new/create.module';
import { VerifyhashAllModule } from './verifyhash-trade-contract-all/verifyhash-open-trade-contract-history.module';
import { CreateContractModule } from './create-contract/create-contract.module';
import { CreateContractClosedModule } from './create-contract-closed/create-contract-closed.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { SharedService } from 'services/shared.service';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { EarthMapComponent } from './earth-map/earth-map.component';
import { AgmCoreModule } from '@agm/core';
import { configmap } from './default';
import { HeaderComponent } from './core/shell/header/header.component';
import { CreateMapContractComponent } from './create-map-contract/create-map-contract.component';

const config: SocketIoConfig = {
  url: 'https://server.orogram.io', options:
  {
    // transports:[ 'websocket']
  }
};

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    ContactModule,
    TermsModule,
    PurchasecryptoModule,
    SellcryptoAdminModule,
    TradeContractHistoryClosedModule,
    SendTokensModule,
    SignupModule,
    VerifyhashAllModule,
    ServicesModule,
    BuyContractClosedModule,
    SellContractClosedModule,
    FaqModule,
    AboutModule,
    LoginModule,
    SignupModule,
    ChangePasswordModule,
    OtpModule,
    SuccessfullpaymentModule,
    SuccessresetpasswdModule,
    RegisteredSuccessfullyModule,
    ProfileViewModule,
    EditProfileModule,
    TradeHistoryModule,
    TransactionModule,
    TradeContractHistoryAllModule,
    TradeContractHistoryModule,
    BuyCryptoModule,
    BuyContractModule,
    SellCryptoModule,
    SellContractModule,
    CreateOrderModule,
    CreateNewOrderModule,
    DashboardModule,
    ManageAccountModule,
    ForgotPasswdModule,
    GoogleAuthModule,
    TwoFactorAuthModule,
    CheckAuthModule,
    WalletModule,
    PrivacyModule,
    CreateContractModule,
    CreateContractClosedModule,
    ClickOutsideModule,
    AppRoutingModule,
    // AgmCoreModule,
    AgmCoreModule.forRoot({
      apiKey: configmap.api,
      libraries: ['places', 'drawing', 'geometry']
    }),
    SocketIoModule.forRoot(config),
    // CoreModule
    // FileUploadModule
  ],
  declarations: [AppComponent, SearchPipe, EarthMapComponent
    , CreateMapContractComponent
  ],
  providers: [DataService, UserService, SharedService, CheckSecretKeyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
