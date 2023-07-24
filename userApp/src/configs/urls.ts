const urls = {
	//"baseUrl":"http://103.12.133.115:3010/v1",
	"baseUrl":"http://localhost:3000/v1",
	"register": "/auth/register",
	"login": "/auth/login",
	"verifyOtp": "/auth/verifyOtp",
	"resendVerificationEmail": "/auth/resendVerificationEmail",
	"getAccount": "/users/account",
	"getTransactions": "/user/getTransactions",
	"getNotifications": "/notification/getNotifications",
	"modifyProfile": "/users/", // Add user id
	"setPushNotificationStatus": "/notification/setPushNotificationStatus",
	"setEmailNotificationStatus": "/notification/setEmailNotificationStatus",
	"getProfile": "/users/profile",
	"updateUser": "/users/", // Add user id,
	"googleAuth": "/auth/googleAuth",
	"purchaseCoins": "/transactions/purchaseCoins",
	"purchaseCoinsAdmin": "/transactions/purchaseCoinsAdmin",
	"getBlockchainTransactions": "/transactions/userTransactions",
	"sendCoins": "/transactions/directTransfer"
}

export default urls;