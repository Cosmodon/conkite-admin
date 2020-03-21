import { observable, action } from "mobx";
import { User } from "./User";
import API from '../libs/api';

export default class UserStore {
	@observable users: User[] = [];
	@observable isLoading: boolean = false;

	constructor(){
		this.fetchUsers();
	}

	@action.bound
	setLoading = async (value) => {
		this.isLoading = value;
	};

	@action.bound
	fetchUsers = async () => {
		const fn = "fetchUsers";
		try {
			this.setLoading(true);

			const users: void|Array<any> = await API.fetchUsers().catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(false);
			users && (this.users = [...(User.createFromArray(users))]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(false);
		return null;
	};

	@action.bound
	updateUser = async ({ corrlinks_id, user }) => {
		const fn = "updateUser";
		try {
			this.setLoading(true);
			await API.updateUser({ corrlinks_id, user });
			this.users = [
				...this.users.filter(a => a.corrlinks_id !== user.corrlinks_id),
				user
			];
			this.setLoading(false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(false);
		}
		return [];
	};

	@action.bound
	addUser = async ({ user }) => {
		const fn = "addUser";
		try {
			this.setLoading(true);
			const response = await API.addUser(user);
			if (response.data.data) {
				this.users = [...this.users, response.data.data];
			}
			this.setLoading(false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(false);
		}
		return [];
	};

	@action.bound
	deleteUser = async ({ corrlinks_id }) => {
		const fn = "deleteUser";
		try {
			this.setLoading(true);
			await API.deleteUser({ corrlinks_id });
			this.users = this.users.filter(a => a.corrlinks_id !== corrlinks_id);
			this.setLoading(false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(false);
		}
		return [];
	};
}
