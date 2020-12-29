export default interface PaymentDetails {
	corrlinks_id: string;
	amount: number;
	comment?: string;
	date_created: Date;
	date_subscription_ends: Date;
}

export interface PurchaseDetails {
	amount: number;
	corrlinks_id: string;
	product_instance_id: number;
	comment?: string;
}
