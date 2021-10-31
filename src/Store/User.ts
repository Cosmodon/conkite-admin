export interface IUser {
	corrlinks_id: string;
	name: string;
	status: string;
	location: string;
	phonebook_entries_allowed: number;
	date_created: string;
	date_released: string;
	date_subscription_ends: string;
	adhoc_phonebook_edit_window_date_end: string;
	adhoc_phonebook_edit_window_date_start: string;
	credits: number;
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
	adhoc_phonebook_edit_window_date_end: string;
	adhoc_phonebook_edit_window_date_start: string;
	date_news_subscription_ends: string;
	date_horoscope_subscription_ends: string;
	date_sports_subscription_ends: string;
	date_investments_subscription_ends: string;
	credits: number;

	constructor(user: IUser){
		Object.assign(this, user);
	}

	static createFromArray(users: Array<IUser>){
		return users.map(user=>new User(user));
	}
}
