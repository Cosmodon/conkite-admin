export default interface PaymentDetails {
	corrlinks_id: string;
	amount: number;
	comment?: string;
	date_created: Date;
	date_subscription_ends: Date;
}
