import { observable, action } from "mobx";
import API from "../libs/api";
import { removeItemsByFieldValue, toYYYYMMDD } from "../libs/common";
import PaymentDetails, { PurchaseDetails } from "./InterfacePaymentDetails";

export default class AppStore {
	@observable isLoadingUsers: boolean = false;
	@observable users: any[] = [];
	@observable isPaymentsLoading: boolean = false;
	@observable payments: any[] = [];
	@observable paymentNotification: {} = null;
	@observable notes: any[] = [];
	@observable products: any[] = [];
	@observable messagesForCorrlinks: any[] = [];
	@observable messagesForSociety: any[] = [];
	@observable isLoading: {
		users: boolean;
		payments: boolean;
		notes: boolean;
		products: boolean;
    messagesForCorrlinks: boolean;
    messagesForSociety: boolean;
	} = {
		users: false,
		payments: false,
		notes: false,
		products: false,
    messagesForCorrlinks: false,
    messagesForSociety: false,
	};

	@action.bound
	fetchUserPayments = async corrlinksId => {
		const fn = "fetchUserPayments";
		try {
			this.isPaymentsLoading = true;
			const data = await API.fetchUserPayments({ corrlinksId }).catch(errors => {
				console.log(fn, "there are some API errors", errors);
			});
			data && (this.payments = [...removeItemsByFieldValue(this.payments, "corrlinks_id", corrlinksId), ...data]);
		} catch (e) {
			console.log(fn, e);
		}
		this.isPaymentsLoading = false;
		return null;
	};

	@action.bound
	setLoading = async (type, value) => {
		this.isLoading = Object.assign({}, this.isLoading, { [type]: value });
	};

	@action.bound
	fetchUsers = async () => {
		const fn = "fetchUsers";
		try {
			this.setLoading("users", true);

			const users = await API.fetchUsers().catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading("users", false);
			users && (this.users = [...users]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading("users", false);
		return null;
	};

	@action.bound
	updateUser = async ({ corrlinks_id, user }) => {
		const fn = "updateUser";
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
	};

	@action.bound
	addUser = async ({ user }) => {
		const fn = "addUser";
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
	};

	@action.bound
	deleteUser = async ({ corrlinks_id }) => {
		const fn = "deleteUser";
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
	};

	@action.bound
	submitPayment = async (paymentDetails: PaymentDetails) => {
		const fn = "submitPayment";

		try {
			const user = { corrlinks_id: paymentDetails.corrlinks_id };
			const payment = Object.assign({}, paymentDetails);
			delete payment.corrlinks_id;
			payment.date_created = toYYYYMMDD(payment.date_created);
			payment.date_subscription_ends = payment.date_subscription_ends ? toYYYYMMDD(payment.date_subscription_ends) : null;

			this.isLoadingUsers = true;
			await API.addUserPayment({ corrlinks_id: user.corrlinks_id, payment });
			this.isLoadingUsers = false;
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
			return false;
		}
		this.paymentNotification = { message: "done", type: "success" };
		return true;
	};

	@action.bound
	submitPurchase = async (purchaseDetails: PurchaseDetails) => {
		const fn = "submitPurchase";

		try {
			this.isLoadingUsers = true;
			await API.postPurchase(purchaseDetails);
			this.isLoadingUsers = false;
		} catch (e) {
			console.log(fn, e);
			this.isLoadingUsers = false;
			return false;
		}
		this.paymentNotification = { message: "done", type: "success" };
		return true;
	};

	@action.bound
	deletePayment = async ({ corrlinks_id, payment_id }) => {
		const fn = "deletePayment";
		const stateVariable = "payments";
		try {
			this.setLoading(stateVariable, true);
			const results = await API.deleteUserPayment({ corrlinks_id, payment_id });
      if (results.status === 200) {
        this.payments = this.payments.filter(a => !(a.corrlinks_id === corrlinks_id && a.id === payment_id));
      }
			this.setLoading(stateVariable, false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(stateVariable, false);
		}
		return [];
	};

	@action.bound
	fetchUserNotes = async ({ corrlinks_id }) => {
		const fn = "fetchUserNotes";
		const stateVariable = "notes";
		try {
			this.setLoading(stateVariable, true);

			const notes = await API.fetchUserNotes({ corrlinks_id }).catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(stateVariable, false);
			notes && (this.notes = [...notes]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(stateVariable, false);
		return null;
	};

	@action.bound
	fetchMessagesForCorrlinks = async ({ corrlinks_id }) => {
		const fn = "fetchMessagesForCorrlinks";
		const stateVariable = "messagesForCorrlinks";
		try {
			this.setLoading(stateVariable, true);

			const messages = await API.fetchMessagesForCorrlinks({ corrlinks_id }).catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(stateVariable, false);
			messages && (this.messagesForCorrlinks = [...messages]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(stateVariable, false);
		return null;
	};

	@action.bound
	fetchMessagesForSociety = async ({ corrlinks_id }) => {
		const fn = "fetchMessagesForSociety";
		const stateVariable = "messagesForSociety";
		try {
			this.setLoading(stateVariable, true);

			const messages = await API.fetchMessagesForSociety({ corrlinks_id }).catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(stateVariable, false);
			messages && (this.messagesForSociety = [...messages]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(stateVariable, false);
		return null;
	};

	@action.bound
	fetchProducts = async () => {
		const fn = "fetchProducts";
		const stateVariable = "products";
		try {
			this.setLoading(stateVariable, true);

			const data = await API.fetchProducts().catch(errors => {
				console.log("there are some API errors", errors);
			});
			this.setLoading(stateVariable, false);
			data && (this.products = [...data]);
		} catch (e) {
			console.log(fn, e);
		}
		this.setLoading(stateVariable, false);
		return null;
	};

	@action.bound
	addUserNote = async ({ corrlinks_id, note }) => {
		const fn = "addUserNote";
		const stateVariable = "notes";
		try {
			this.setLoading(stateVariable, true);
			const response = await API.addUserNote({ corrlinks_id, note });
			if (response.data.data) {
				this.notes = [...this.notes, response.data.data];
			}
			this.setLoading(stateVariable, false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(stateVariable, false);
		}
		return [];
	};

	@action.bound
	deleteUserNote = async ({ corrlinks_id, note_id }) => {
		const fn = "deleteUserNote";
		const stateVariable = "notes";
		try {
			this.setLoading(stateVariable, true);
			await API.deleteUserNote({ corrlinks_id, note_id });
			this.notes = this.notes.filter(a => !(a.corrlinks_id === corrlinks_id && a.id === note_id));
			this.setLoading(stateVariable, false);
		} catch (e) {
			console.log(fn, e);
			this.setLoading(stateVariable, false);
		}
		return [];
	};
}
