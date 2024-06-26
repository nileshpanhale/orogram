import baseUrl from '../../BaseUrl'
const urls = {
	"baseUrl": baseUrl,
	"enquiry": "/enquery/sendEnquiry",
	"register": "/auth/register",
	"login": "/auth/login",
	"logout": "/auth/logout",
	"verifyOtp": "/verify/otp",
	"userdelete": "/users/",
	"imageupload": "/users/profileImageUpload",
	"docUpload": "/users/docUpload",
	"imageuploadmulti": "/transactionscontract/profileImageUploadMultiple",
	"userprofileUpdate": "/users/update",
	"confirmWiretransfer": "/transferMoney/wire",
	"getTx": "/auth/getTx",
	"search": "/auth/search",
	"purchaseCoins": "/transactions/purchaseCoins",
	"purchaseCoinsAdmin": "/transactions/purchaseCoinsAdmin",
	"changeStatusUser": "/transactions/updateStatusUser/",
	"getAccountInfo": "/admin/getAccountInfo",
	"purchasetx": "/transactions/purchaseCoins", //get purchase transaction user
	"purchasetxadmin": "/transactions/purchaseCoinsAdmin", //get purchase transaction admin
	"getTradeHistory": "/transactions/userTrades",
	"getTradeContractHistory": "/transactionscontract/userTrades",
	// "getAllTradeContractHistory": "/transactionscontract/trades",/transactionscontract/userContracts?perPage=undefined&page=1
	"getAllTradeContractHistory": "/transactionscontract/userContracts",
	"getTradeContractAllHistory": "/transactionscontract/allcontracts",
	"changeStatus": "/transactions/updateStatus/",
	"changeStatusAdminTran": "/transactions/updateStatusUser/",
	"acceptAdminReq": "/transactions/acceptAdminReq/",
	"changeStatusContract": "/transactionscontract/updateStatus/",
	"buytxn": "/transactions/orders?type=buy",
	"selltxn": "/transactions/orders?type=sell",
	"buycontracttxn": "/transactionscontract/orders?type=buy",
	"sellcontracttxn": "/transactionscontract/orders?type=sell",
	"accountDetails": "/users/account",
	"accountCoinDetails": "/transactions/getAccountCoinDetail",
	"createOrder": "/transactions/orders/",
	"createContractOrder": "/transactionscontract/orders/",
	"createAccount": "/users/bankAccounts",
	"getProfile": "/users/profile",
	"forgotpasswd": "/auth/forgotpassword",
	"resetpasswd": "/users/updatePassword",
	"baseImageUrl": baseUrl + '/assets/images/',
	"generateOtp": "/generate/otp",
	"enableGoogle": "/users/googleAuth?status=1",
	"checkCode": "/auth/googleAuth",
	"buyCoin": "/transactions/orders",
	"sellCoin": "/transactions/orders",
	"getBlockchainTransactions": "/transactions/userTransactions",
	"sendCoins": "/transactions/directTransfer",
	"buyCoinContract": "/transactionscontract/orders",
	"searchUser": "/transactionscontract/searchUser",
	"searchDescription": "/transactionscontract/searchDescription",
	"btcapi": "https://api.coindesk.com/v1/bpi/currentprice.json",
	"goldprice": "/enquery/goldprice",
	//"goldapi" : "https://globalmetals.xignite.com/xGlobalMetals.json/GetRealTimeMetalQuote?Symbol=XAU&Currency=USD&_token=A65D7CEE77C04CFFA0823A39961B0E42",
	"currencyRate": "/enquery/currencyRate",
	"sellCoinContract": "/transactionscontract/orders",
	"gettxhash": "/transactionscontract/getContractDetails",
	"gettxhash1": "/transactionscontract/getTradeDetail",
	"gettxhash2": "/transactionscontract/getAdminTxDetail",
	"buyLand": "/transactionscontract/purchaseLand",
	"getMap" : "/transactionscontract/mapRead",
	"userLandContracts" : "/transactionscontract/getLandContractTrades"
}

export default urls;