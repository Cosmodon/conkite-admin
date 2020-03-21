import { observable, action } from "mobx";
import API from "../libs/api";
import { PhonebookEntry } from "./Phonebook";

export default class PhonebookStore {
	@observable entries: PhonebookEntry[] = [];
	@observable isLoading: boolean = false;

	@action.bound
	setLoading = async value => {
		this.isLoading = value;
	};

	@action.bound
	fetchPhonebookEntries = async corrlinksId => {
		const fn = "fetchPhonebookEntries";
		if (!corrlinksId) this.entries = [];

		try {
			this.setLoading(true);

			const entries: void | Array<any> = await API.fetchPhonebookEntries({ corrlinksId }).catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(false);
			entries && (this.entries = [...PhonebookEntry.createFromArray(entries)]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(false);
		return null;
	};

	// @action.bound
	// updatePhonebookEntry = async ({ corrlinks_id, entry }) => {
	// 	const fn = "updatePhonebookEntry";
	// 	try {
	// 		this.setLoading(true);
	// 		const entries = toJS(this.entries).map(a =>
	// 			a.line_id === entry.line_id ? entry : a
	// 		);
	// 		await API.updatePhonebookEntries({ corrlinks_id, entries });
	// 		this.entries = [...entries];
	// 	} catch (e) {
	// 		console.log(fn, e);
	// 	}
	// 	this.setLoading(false);
	// 	return [];
	// };

	// @action.bound
	// addUser = async ({ user }) => {
	// 	const fn = "addUser";
	// 	try {
	// 		this.setLoading(true);
	// 		const response = await API.addUser(user);
	// 		if (response.data.data) {
	// 			this.users = [...this.users, response.data.data];
	// 		}
	// 		this.setLoading(false);
	// 	} catch (e) {
	// 		console.log(fn, e);
	// 		this.setLoading(false);
	// 	}
	// 	return [];
	// };

	// @action.bound
	// deleteUser = async ({ line_id }) => {
	// 	const fn = "deleteUser";
	// 	try {
	// 		this.setLoading(true);
	// 		await API.deleteUser({ corrlinks_id });
	// 		this.users = this.users.filter(a => a.corrlinks_id !== corrlinks_id);
	// 		this.setLoading(false);
	// 	} catch (e) {
	// 		console.log(fn, e);
	// 		this.setLoading(false);
	// 	}
	// 	return [];
	// };
}
