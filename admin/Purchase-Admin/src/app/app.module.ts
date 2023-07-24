import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UserResponseService } from '../Services/userResponse.service';
import { UserService } from '../Services/user.service';
import { routing } from './app.routing';
import { HomeModule } from './home/home.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TradesComponent } from './trades/trades.component';
import { ContractsComponent } from './contracts/contracts.component';
import { PrivateContractsComponent } from './private-contracts/private-contracts.component';
import { WalletTransactionComponent } from './wallet-transactions/wallet-transaction.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionSellComponent } from './transaction-sell/transaction-sell.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SendTokensComponent } from './send-tokens/send-tokens.component';
import { VerifyHashComponent } from './verify-hash/verify-hash.component';
import { AdminPurchasecryptoComponent } from './admin-purchase/admin-purchase.component';
import { NewUserModule } from './new-user/new-user.module';
import { FilterPipe } from './filterpipe';
import { FilterUser } from './filterType';
import { FilterStatus } from './filterStatus';
// import { SearchPipe } from './transaction/search.pipe';
import { SearchPipe } from './searchFilter.pipe';
// import { SearchPipeSendToken } from './send-tokens/search.pipe';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

//  import { NgxLoading}
import { AuthGuardService } from './authGuard';
import { AuthenticationService } from './authentication.service';

import { Ng2OrderModule } from 'ng2-order-pipe';
import { AdminComponent } from './admin/admin.component';
import { FileUploadModule } from 'ng2-file-upload';
// import { FileSelectDirective } from 'ng2-file-upload';

import { VotingComponent } from './voting/voting.component';
import { NotificationComponent } from './notification/notification.component';

// import baseurl from '../../../../AdminIdChat';
import { SharedService } from 'Services/shared.services';
import { LandContractsComponent } from './land-contracts/land-contracts.component';


// const config: SocketIoConfig = { url: 'http://n4.iworklab.com:4013', options: {} };

const config: SocketIoConfig = {
  url: 'https://server.orogram.io', options:
  {
    // transports:[ 'websocket']
  }
};        // client server



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TradesComponent,
    ContractsComponent,
    PrivateContractsComponent,
    WalletTransactionComponent,
    TransactionComponent,
    TransactionSellComponent,
    AccountSettingsComponent,
    UserDetailsComponent,
    ForgotPasswordComponent,
    SendTokensComponent,
    VerifyHashComponent,
    AdminPurchasecryptoComponent,
    FilterPipe,
    FilterUser,
    FilterStatus,
    AdminComponent,
    // FileSelectDirective,
    VotingComponent,
    SearchPipe,
    // SearchPipeSendToken,
    NotificationComponent,
    LandContractsComponent,

  ],
  imports: [
    HomeModule,
    HttpClientModule,
    NewUserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2OrderModule,
    NgxPaginationModule,
    routing,
    SocketIoModule.forRoot(config),
    FileUploadModule,
  ],
  providers: [UserService, SharedService, UserResponseService, AuthGuardService, AuthenticationService, SearchPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
