import { isObservable, observable } from "mobx";
import { create } from "apisauce";
import api from "../libs/api";

interface Authentication {
	authorization: string;
}

const endpoint = "http://localhost:3000";

class AuthenticationStore {
	@observable authorization: string = "";
	@observable isLoggedIn: boolean = false;
	api = create({
		baseURL: endpoint,
		headers: { Accept: "application/json" }
	});
	constructor() {
		// TODO get authorization from cookie
	}
	doLogin = async ({ email, password }) => {
		try {
			const result: any = await this.api.post("/login", { email, password });
			this.authorization = result.authorization;
			this.isLoggedIn = true;
		} catch (e) {}
	};
	checkLogin = async () => {
		const data = {};
		await this.api.post("/login", data);
	};
}

export default AuthenticationStore;
