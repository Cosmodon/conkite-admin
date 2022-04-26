import { observable, action } from "mobx";

class NotificationStore {
	@observable messageQueue = [];

	@action.bound
	addToMessageQueue = message => {
		this.messageQueue.push(message);
	};

	@action.bound
	popFromMessageQueue = () => {
		this.messageQueue.pop();
	};

	getFromMessageQueue = () => {
		if (!this.messageQueue.length) return null;
		return this.messageQueue[0];
	};
}

export default NotificationStore;
