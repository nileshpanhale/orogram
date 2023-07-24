import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
	userId: string;
	transactions: Array<{
		trxId: string,
		senderId: string,
		receiverId: string,
		time: number,
		status: string,
		amount: number,
		fee: number
	}>;
	notifications: Array<{
	  type: string,
	  numberOfCoins: number,
	  walletAddress:  string,
	  date: string,
	  customNotification: string
	}>;
	profile = {};
	token = {};
	user = {};
	walletAddress;
	constructor() {}

	getUserId() {
		return this.userId;
	}
	
	setUserId(userId: string) {
		this.userId = userId;
	}

	getTransactions() {
		return this.transactions;
	}

	setTransactions(transactions) {
		this.transactions = transactions;
	}

	addTransactions(transactions) {
		this.transactions = transactions && transactions.length > 0 ? transactions.concat(this.transactions) : this.transactions;
		return this.transactions;
	}

	getNotifications() {
		return this.notifications;
	}

	setNotifications(notifications) {
		this.notifications = notifications;
	}

	addNotifications(notifications) {
		this.notifications = notifications && notifications.length > 0 ? notifications.concat(this.notifications) : this.notifications;
		return this.notifications;
	}

	getProfile() {
		return this.profile;
	}

	setProfile(profile) {
		this.profile = profile;
	}

	setToken(token) {
		this.token  = token;
	}

	getToken() {
		return this.token;
	}

	setUser(user) {
		this.user  = user;
	}

	getUser() {
		return this.user;
	}

	setWalletAddress(walletAddress) {
		this.walletAddress  = walletAddress;
	}

	getWalletAddress() {
		return this.walletAddress;
	}
}