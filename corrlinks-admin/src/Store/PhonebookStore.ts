import { observable, action, toJS } from "mobx";
import API from "../libs/api";
import { PhonebookEntry } from "./PhonebookEntry";

function stripTableData(a: any) {
	return a.map(({ tableData, ...fields }) => ({ ...fields }));
}

export default class PhonebookStore {
	@observable entries: PhonebookEntry[] = [];
	@observable isLoading: boolean = false;

	@action.bound
	setLoading = async value => {
		this.isLoading = value;
	};

	@action.bound
	fetchPhonebookEntries = async corrlinks_id => {
		const fn = "fetchPhonebookEntries";
		if (!corrlinks_id) this.entries = [];

		try {
			this.setLoading(true);

			const entries: void | Array<any> = await API.fetchPhonebookEntries({ corrlinks_id }).catch(errors => {
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

	@action.bound
	updatePhonebookEntry = async ({ corrlinks_id, entry }) => {
		const fn = "updatePhonebookEntry";
		let result = true;
		try {
			this.setLoading(true);
			const entries = stripTableData(toJS(this.entries).map(a => (a.line_id === entry.line_id ? entry : a)));
			await API.updatePhonebookEntries({ corrlinks_id, entries });
			this.entries = [...entries];
		} catch (e) {
			result = false;
			const errorMsg = fn + ":" + e.map(line => `\n  line ${line.line_id}:\n    ${line.errors.join("\n    ")}`);
			alert(errorMsg);
		}
		this.setLoading(false);
		return result;
	};

	@action.bound
	sendTextPhonebook = async ({ corrlinks_id, text, account, responseRequired = null }) => {
		const fn = "sendTextPhonebook";
		let result = "";
		try {
			this.setLoading(true);
			const result = await API.sendTextPhonebook({ corrlinks_id, text, responseRequired, account });
			this.setLoading(false);
			return result;
		} catch (e) {
			console.log(e);
			result = fn + ":" + e.map(line => `\n  line ${line.line_id}:\n    ${line.errors.join("\n    ")}`);
		}
		this.setLoading(false);
		return result;
	};

	@action.bound
	sendToMessageFromCorrlinks = async ({ corrlinks_id, text, subject, account }) => {
		const fn = "sendToMessageFromCorrlinks";
		let result = "";
		try {
			this.setLoading(true);
			const result = await API.sendToMessageFromCorrlinks({ corrlinks_id, text, subject, account });
			this.setLoading(false);
			return result;
		} catch (e) {
			console.log(e);
			result = fn + ":" + e.map(line => `\n  line ${line.line_id}:\n    ${line.errors.join("\n    ")}`);
		}
		this.setLoading(false);
		return result;
	};

	@action.bound
	getPhonebookEmail = async ({ corrlinks_id }) => {
		const fn = "getPhonebookEmail";
		let result = "";
		try {
			this.setLoading(true);
			const result = await API.getPhonebookEmail({ corrlinks_id });
			return result;
		} catch (e) {
			result = fn + ":" + e.map(line => `\n  line ${line.line_id}:\n    ${line.errors.join("\n    ")}`);
		}
		this.setLoading(false);
		return result;
	};

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
