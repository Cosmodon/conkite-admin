import { observable } from 'mobx';
import API from '../libs/api';

export default class AppStore {
	@observable isLoadingUsers: boolean = false;
	@observable users: any[] = [];

	fetchUsers = async () => {
		const fn = 'fetchUsers';
		try {
			this.isLoadingUsers = true;
			const users = await API.fetchUsers();
			if (users && (users as []).length) {
				this.isLoadingUsers = false;
			}
			this.users = [...users];
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
			this.users = [...this.users];
		}
		return [];
	}
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
