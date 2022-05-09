
export interface IUser {
	corrlinks_id: string;
	name: string;
	status: string;
	location: string;
	date_created: string;
	date_released: string;
	date_subscription_ends: string;
}

export class User implements IUser {
	corrlinks_id: string;
	name: string;
	status: string;
	location: string;
	date_created: string;
	date_released: string;
	date_subscription_ends: string;
	adhoc_phonebook_edit_window_date_end: string;
	adhoc_phonebook_edit_window_date_start: string;

	constructor(user: IUser){
		Object.assign(this, user);
	}

	static createFromArray(users: Array<IUser>){
		return users.map(user=>new User(user));
	}
}
