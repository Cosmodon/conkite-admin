
export interface IPhonebookEntry {
	line_id: number;
	label: string;
	mobile: string;
	isValid(): boolean;
}

export class PhonebookEntry implements IPhonebookEntry {
	line_id: number;
	label: string;
	mobile: string;

	errors: string[];

	constructor(user: IPhonebookEntry) {
		Object.assign(this, user);
	}

	isValid(): boolean {
		this.errors = [];
		if (this.label.length < 1) this.errors.push("Label must have at least 1 character");
		if (this.mobile.length < 10) this.errors.push("Mobile must contain 10 characters");
		return this.errors.length === 0;
	}

	static createFromArray(entries: Array<IPhonebookEntry>) {
		return entries.map(entry => new PhonebookEntry(entry));
	}
}
