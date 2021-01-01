import { create } from "apisauce";
import { PurchaseDetails } from "../Store/InterfacePaymentDetails";

class Auth {
	logout(msg) {
		alert(`logout! ${msg}`);
	}
	login() {
		alert("login!");
	}
}

export const endpoints: Array<string> = ["https://theeblvd.ngrok.io", "http://localhost:3000"];

class API {
	auth = new Auth();
	api = create({
		baseURL: endpoints[0],
		headers: { Accept: "application/json" }
	});
	constructor() {
		const naviMonitor = response => {
			if (response.status === 403 || response.status === 401) {
				this.auth.logout(`due to status code ${response.status}`);
			}
		};
		this.api.addMonitor(naviMonitor);
		if (window.location.href.includes("localhost")) {
			this.setEndpoint(endpoints[1]);
		}
	}
	setEndpoint(endpoint: string) {
		this.api = create({
			baseURL: endpoint,
			headers: { Accept: "application/json" }
		});
	}
	getEndpoint(): string {
		return this.api.getBaseURL();
	}
	getEndpoints(): Array<string> {
		return endpoints;
	}

	fetchUserPayments = async ({ corrlinksId }, options?): Promise<any[]> => {
		const response = await this.api.get(`users/${corrlinksId}/payments`, options);

		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}
		return [];
	};

	fetchUsers = async (options?): Promise<any[]> => {
		const response = await this.api.get("users", options);

		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}
		return [];
	};

	updateUser = async ({ corrlinks_id, user }, options?): Promise<boolean> => {
		await this.api.put(`/users/${corrlinks_id}`, user, options);
		return user;
	};

	addUser = async (user, options?): Promise<any> => {
		const newUser = await this.api.post(`/users`, user, options);
		return newUser;
	};

	deleteUser = async ({ corrlinks_id }, options?): Promise<any> => {
		await this.api.delete(`/users/${corrlinks_id}`, options);
		return true;
	};

	addUserPayment = async ({ corrlinks_id, payment }, options?): Promise<any> => {
		const result = await this.api.post(`/users/${corrlinks_id}/payments`, payment, options);
		return result;
	};

	postPurchase = async (pd: PurchaseDetails, options?): Promise<any> => {
		const { amount } = pd;
		const result = await this.api.post(`/user/${pd.corrlinks_id}/purchase/${pd.product_instance_id}`, { amount }, options);
		return result;
	};

	fetchPhonebookEntries = async ({ corrlinks_id }, options?): Promise<any[]> => {
		const response = await this.api.get(`phonebook/${corrlinks_id}`, options);

		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}
		return [];
	};

	getPhonebookEmail = async ({ corrlinks_id }, options?): Promise<string> => {
		const response: any = await this.api.get(`phonebook-email/${corrlinks_id}?subject=phonebook`, options);
		return response.data;
	};

	updatePhonebookEntries = async ({ corrlinks_id, entries }, options?): Promise<any[]> => {
		const response = await this.api.put(`phonebook/${corrlinks_id}`, entries, options);

		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}

		if (response.data["error"]) {
			throw response.data["error"];
		}

		return [];
	};

	sendTextPhonebook = async ({ corrlinks_id, text, account, responseRequired = null }, options?): Promise<any[]> => {
		const response = await this.api.put(`phonebook/${corrlinks_id}/process`, { text, responseRequired, account }, options);

		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}

		if (response.data["text"]) {
			return response.data["text"];
		}

		if (response.data["error"]) {
			throw response.data["error"];
		}

		return null;
	};

	sendToMessageFromCorrlinks = async ({ corrlinks_id, text, account, subject = "phonebook" }, options?): Promise<any[]> => {
		const response = await this.api.post(`message-from-corrlinks`, { to: "na", from: `blank (${corrlinks_id})`, body: text, subject, account }, options);
		console.log(response);
		alert(response["data"]["data"]["message"] || response["data"]["data"]["status"]);
		return null;
	};

	fetchUserNotes = async ({ corrlinks_id }, options?): Promise<any[]> => {
		const response = await this.api.get(`users/${corrlinks_id}/notes`, options);
		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}
		return [];
	};

	fetchProducts = async (options?): Promise<any[]> => {
		const response = await this.api.get(`products`, options);
		if (response.data && response.data["data"]) {
			const data: [] = response.data["data"] as [];
			return [...data];
		}
		return [];
	};

	addUserNote = async ({ corrlinks_id, note }, options?): Promise<any> => {
		const newNote = await this.api.post(`users/${corrlinks_id}/notes`, { note }, options);
		return newNote;
	};

	deleteUserNote = async ({ corrlinks_id, note_id }, options?): Promise<any> => {
		await this.api.delete(`/users/${corrlinks_id}/notes/${note_id}`, options);
		return true;
	};
}

export default new API();
