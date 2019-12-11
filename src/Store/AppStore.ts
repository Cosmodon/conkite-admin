import { observable, action } from 'mobx';
import API from '../libs/api';
import { removeItemsByFieldValue } from '../libs/common';

export default class AppStore {
	@observable isLoadingUsers: boolean = false;
	@observable users: any[] = [];
	@observable isPaymentsLoading: boolean = false;
	@observable payments: any[] = [];

	@action.bound
	fetchUserPayments = async (corrlinksId) => {
		const fn = 'fetchUserPayments';
		try {
			this.isPaymentsLoading = true;
			const data = await API.fetchUserPayments({ corrlinksId }).catch((errors) => {
				console.log(fn, 'there are some API errors', errors);
			});
			data && (this.payments = [...removeItemsByFieldValue(this.payments, 'corrlinks_id', corrlinksId), ...data]);
		} catch (e) {
			console.log(fn, e);
		}
		this.isPaymentsLoading = false;
		return null;
	}

	@action.bound
	fetchUsers = async () => {
		const fn = 'fetchUsers';
		try {
			this.isLoadingUsers = true;
			const users = await API.fetchUsers().catch((errors) => {
				console.log('there are some API errors', errors);
			});
			users && (this.users = [...users]);
		} catch (e) {
			console.log(fn, e);
		}
		this.isLoadingUsers = false;
		return null;
	}

	@action.bound
	updateUser = async ({ corrlinks_id, user }) => {
		const fn = 'updateUser';
		try {
			this.isLoadingUsers = true;
			await API.updateUser({ corrlinks_id, user });
			this.users = [...this.users.filter(a => a.corrlinks_id !== user.corrlinks_id), user];
			this.isLoadingUsers = false;
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
		}
		return [];
	}

	@action.bound
	addUser = async ({ user }) => {
		const fn = 'addUser';
		try {
			this.isLoadingUsers = true;
			const response = await API.addUser(user);
			if (response.data.data) {
				this.users = [...this.users, response.data.data];
			}
			this.isLoadingUsers = false;
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
		}
		return [];
	}

	@action.bound
	deleteUser = async ({ corrlinks_id }) => {
		const fn = 'deleteUser';
		try {
			this.isLoadingUsers = true;
			await API.deleteUser({ corrlinks_id });
			this.users = this.users.filter(a => a.corrlinks_id !== corrlinks_id);
			this.isLoadingUsers = false;
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
		}
		return [];
	}
}
