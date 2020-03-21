
export interface IUser {
	corrlinks_id: string;
	name: string;
	status: string;
	location: string;
	phonebook_entries_allowed: number;
	date_created: string;
	date_released: string;
	date_subscription_ends: string;
}

export class User implements IUser {
	corrlinks_id: string;
	name: string;
	status: string;
	location: string;
	phonebook_entries_allowed: number;
	date_created: string;
	date_released: string;
	date_subscription_ends: string;

	constructor(user: IUser){
		Object.assign(this, user);
	}

	static createFromArray(users: Array<IUser>){
		return users.map(user=>new User(user));
	}
}