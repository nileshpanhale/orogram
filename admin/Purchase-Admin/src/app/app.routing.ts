import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { SendTokensComponent } from './send-tokens/send-tokens.component';
import { VerifyHashComponent } from './verify-hash/verify-hash.component';
import { TradesComponent } from './trades/trades.component';
import { ContractsComponent } from './contracts/contracts.component';
import { PrivateContractsComponent } from './private-contracts/private-contracts.component';
import { WalletTransactionComponent } from './wallet-transactions/wallet-transaction.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionSellComponent } from './transaction-sell/transaction-sell.component';
import { AdminPurchasecryptoComponent } from './admin-purchase/admin-purchase.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuardService } from './authGuard';
import{AppComponent} from './app.component';
import { AdminComponent } from './admin/admin.component';

import { VotingComponent } from './voting/voting.component';
import { NotificationComponent } from './notification/notification.component';
import { LandContractsComponent } from './land-contracts/land-contracts.component';

export const routes : Routes = [
    {path:'AppComponent', component: AppComponent},
    {path:'home', component: HomeComponent},
    { path:'forget_password', component:ForgotPasswordComponent},
  
    // { path:'admin', component:AdminComponent  },
    { path:'admin', component:AdminComponent ,   
   children: [
    { path:'dashboard', component:DashboardComponent, canActivate: [AuthGuardService] },
    { path:'notification', component:NotificationComponent, canActivate: [AuthGuardService] },
    { path:'trades', component:TradesComponent, canActivate: [AuthGuardService]},
    { path:'contracts', component:ContractsComponent, canActivate: [AuthGuardService]},
    { path:'private-contracts', component:PrivateContractsComponent, canActivate: [AuthGuardService]},
    { path:'land-contracts', component:LandContractsComponent, canActivate: [AuthGuardService]},
    { path:'wallet-transaction', component:WalletTransactionComponent, canActivate: [AuthGuardService]},
    { path:'transaction', component:TransactionComponent, canActivate: [AuthGuardService]},
    { path:'transaction-sell', component:TransactionSellComponent, canActivate: [AuthGuardService]},
    { path:'user_details', component:UserDetailsComponent, canActivate: [AuthGuardService]},
        

    { path:'account_setting', component:AccountSettingsComponent, canActivate: [AuthGuardService] },
    { path:'send_token', component:SendTokensComponent, canActivate: [AuthGuardService]},
    { path:'verify_hash', component:VerifyHashComponent, canActivate: [AuthGuardService]},
    { path:'admin-purchase', component:AdminPurchasecryptoComponent, canActivate: [AuthGuardService]},
    { path:'new_user', component:NewUserComponent, canActivate: [AuthGuardService] },
    { path:'vote', component:VotingComponent, canActivate: [AuthGuardService] },
]},
     { path:'**', redirectTo:'/home',pathMatch:'full' },
     { path:'', redirectTo:'/home', pathMatch:'full' }
];

export const routing : ModuleWithProviders = RouterModule.forRoot(routes);