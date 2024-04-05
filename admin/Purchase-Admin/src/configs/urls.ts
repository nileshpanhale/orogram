import baseUrl from '../../BaseUrl'
const urls = {
	"baseUrl":baseUrl,
	"confirmCoin": "/transactions/confirmCoin",
	"enquiry": "/enquery/sendEnquiry",
	"logout": "/auth/logout",
	"register": "/auth/register",
	"verifyOtp": "/verify/otp",
	"userdelete":"/user/",
	"imageupload":"/user/profileImageupload",
	"userprofileUpdate":"/user/",
	"confirmWiretransfer":"/transferMoney/wire",
	"getTx": "/auth/getTx",
	"search":"/auth/search",
    "purchaseCoin" : "/auth/purchase",
    "authOTp":"/auth/otp",
	"forget":"/admin/forgetPassword",
	"forgotpasswd":"/auth/forgotpassword",
    "resetpass":"/users/password/",
    
    "profilepic":"/users/profileImageUpload",
    "imageUpload2":"/user/imageUpload",
	"sendcoin":"/transactions/sendCoins",
	

	"login": "/auth/login",
	"companyStats":"/admin/companyStat", //get company balance
	"adminStats":"/admin/tradeStats", //get trade balance
	"userStats":"/admin/userStats", //get user balance
	"holdStats":"/admin/holdedTotal", //get total holded balance from all users
	"purchasetx":"/transactions/purchaseCoins", //get purchase transaction
	"userDetails":"/users", //get user details
	"changeStatus":"/transactions/updateStatus/", //changeTransactionStatus
	"changeStatusUser" : "/transactions/updateStatusUser/",
	"changeUserStatus":"/users", //changeUserStatus by user admin buy coin
	"updatepassword":"/users/updatePassword", // change Password from account setting
	"createUser":"/admin/createUser",
	"tradetx":"/transactions/trades",
	"contracttx":"/transactionscontract/trades",
	"landContracttx":"/transactionscontract/getLandContractTrades",
	"admintxn":"/transactions/adminTransactions",
	"gettxhash":"/transactionscontract/getContractDetails",
	"gettxhash1":"/transactionscontract/getTradeDetail",
	"gettxhash2":"/transactionscontract/getAdminTxDetail",
	"purchaseCoins": "/transactions/purchaseCoins",
	"purchaseCoinsAdmin": "/transactions/purchaseCoinsAdmin",
	"getUserProfile":"/users/profile",
	"accountDetails":"/admin/account",
	"getAccountInfo":"/admin/getAccountInfo",
	"accountInfo":"/admin/updateAccountInfo",
	"changeActivity":"/users/",
	"delegateList":"/admin/delegates", //to be changed
	"upvotedUsers":"/admin/votedList",
	"baseImageUrl": baseUrl + '/assets/images/',
	"checkForUser":"/checkForUser",
	"sendForUpvote":"/admin/vote",
	"sendForDownvote":"/admin/unvote",
	"delegateRegister":"/admin/delegateRegister",
	"changeTradeStatus":"/transactions/confirmTransaction",
	"goldprice":"/enquery/goldprice",
	//"goldapi" : "https://globalmetals.xignite.com/xGlobalMetals.json/GetRealTimeMetalQuote?Symbol=XAU&Currency=USD&_token=A65D7CEE77C04CFFA0823A39961B0E42",
	"currencyRate": "/enquery/currencyRate",
	"changeContractStatus":"/transactionscontract/confirmLandTransaction",
	"getBlockchainTransactions":"/admin/walletTransactions",
	"getAccountDetails":"/users/account1",
	"getBlockchainTransactions2": "/transactions/userTransactions2"
	
}

export default urls;
