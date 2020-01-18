import { sendNotification, arrayToMap } from "../libs/common";
import { configure, observable, decorate, action, runInAction } from "mobx";
configure({ enforceActions: "observed" });

interface ResponseObject {
	data: any;
}

interface MessageBody {
	headers: object;
	response: boolean;
	body: {};
}

class APIClass {
	async get(
		apiName: string,
		path: string,
		body: MessageBody
	): Promise<ResponseObject> {
		let result: ResponseObject = {
			data: []
		};
		return result;
	}
	async put(
		apiName: string,
		path: string,
		body: MessageBody
	): Promise<ResponseObject> {
		let result: ResponseObject = {
			data: []
		};
		return result;
	}
	async post(
		apiName: string,
		path: string,
		body: MessageBody
	): Promise<ResponseObject> {
		let result: ResponseObject = {
			data: []
		};
		return result;
	}
}

const API = new APIClass();

class GenericStore {
	isBusy = false;
	data = [];
	idxById = {};
	apiName = "none";
	singular = "none";

	// constructor(){

	// }

	async getInitialisedMessage() {
		return {
			headers: {},
			response: true,
			body: {}
		};
	}

	processErrorCode = error => {
		console.log(`GenericStore.${this.constructor.name}:`, error.response);

		if (!error.response) {
			console.log("GenericStore detected a possible connection problem.");
			console.log(error);
			console.log(JSON.stringify(error));
			sendNotification("connection issue. please check console", "error");
			return false;
		}

		const errorText =
			error.response.data.message ||
			error.response.data.statusText ||
			error.response.data.error ||
			"unknown";
		const errorCode =
			error.response.data.code || error.response.data.statusCode;

		if (
			(errorCode >= 400 && errorCode < 500) ||
			(errorCode >= 400 && errorCode < 500)
		) {
			sendNotification(errorText, "warning");
			return false;
		}

		sendNotification(errorText, "error");
	};

	//@action
	addDataItem = dataItem => {
		this.data = [...this.data, dataItem];
	};

	//@action
	setData = data => {
		this.data = data;
		this.idxById = arrayToMap(data, "id");
		localStorage[this.apiName] = JSON.stringify(data);
	};

	//@action
	setDataItem = dataItem => {
		let isNew = true;
		this.data = this.data.map(item => {
			if (item.id !== dataItem.id) {
				return item;
			}
			isNew = false;
			return dataItem;
		});
		if (isNew) {
			this.data.push(dataItem);
		}
		this.idxById = arrayToMap(this.data, "id");
	};

	//@action.bind
	check = async () => {
		let path = `/${this.singular}`;
		let message = await this.getInitialisedMessage();
		this.isBusy = true;
		console.log(`${path}`);

		return API.get(this.apiName, path, message)
			.then(response => {
				this.setData(response.data[this.singular]);
				this.isBusy = false;
				return true;
			})
			.catch(error => {
				runInAction(() => {
					this.isBusy = false;
					this.processErrorCode(error);
				});
				return false;
			});
	};

	//@action.bind
	list = async () => {
		let path = `/${this.singular}`;
		let message = await this.getInitialisedMessage();
		this.isBusy = true;

		return API.get(this.apiName, path, message)
			.then(response => {
				this.setData(response.data[this.singular]);
				this.isBusy = false;
				return true;
			})
			.catch(error => {
				this.isBusy = false;
				this.processErrorCode(error);
				return false;
			});
	};

	//@action.bind
	update = async item => {
		let path = `/${this.singular}/${item.id}`;
		let message = await this.getInitialisedMessage();
		Object.assign(message.body, item);
		this.isBusy = true;

		return API.put(this.apiName, path, message)
			.then(response => {
				this.setDataItem(response.data[this.singular]);
				this.isBusy = false;
				sendNotification(`${this.singular} Updated`, "success");
				return true;
			})
			.catch(error => {
				this.isBusy = false;
				this.processErrorCode(error);
				return false;
			});
	};

	create = async item => {
		let path = `/${this.singular}`;
		this.isBusy = true;
		let message = await this.getInitialisedMessage();
		Object.assign(message.body, item);

		return API.post(this.apiName, path, message)
			.then(response => {
				this.addDataItem(response.data[this.singular]);
				this.isBusy = false;
				sendNotification(`${this.singular} Created`, "success");
				return true;
			})
			.catch(error => {
				this.isBusy = false;
				this.processErrorCode(error);
				return false;
			});
	};

	init = () => {
		try {
			const backup = JSON.parse(localStorage[this.apiName] || "[]");
			if (backup.length > 0) {
				this.setData(backup);
			}
			this.check();
		} catch (e) {
			console.log(`Error occurred in store ${this.constructor.name} init()`, e);
			// clear store in case any bad data smell left
			delete localStorage[this.apiName];
		}
	};

	findByField = (fieldName, value) => {
		return this.data.find(a => a[fieldName] === value);
	};
}

decorate(GenericStore, {
	data: observable,
	isBusy: observable,
	idxById: observable,

	init: action,
	setData: action,
	create: action,
	update: action,
	check: action,

	findByField: action,
	addDataItem: action,
	setDataItem: action
});

export default GenericStore;
