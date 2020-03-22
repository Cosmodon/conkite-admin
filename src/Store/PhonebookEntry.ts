export interface IPhonebookEntry {
	line_id: number;
	label: string;
	mobile: string;
	validate(): Array<string>;
}

export class PhonebookEntry implements IPhonebookEntry {
	line_id: number;
	label: string;
	mobile: string;

	constructor(user: IPhonebookEntry) {
		const { line_id, label, mobile } = user;
		this.line_id = line_id;
		this.label = label;
		this.mobile = mobile;
	}

	validate(): Array<string> {
		const errors = [];
		if (this.label.length < 1) errors.push("Label must have at least 1 character");
		if (this.mobile.length < 10) errors.push("Mobile must contain 10 characters");
		return errors;
	}

	static createFromArray(entries: Array<IPhonebookEntry>) {
		return entries.map(entry => new PhonebookEntry(entry));
	}
}
