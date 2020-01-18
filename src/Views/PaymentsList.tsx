import React from "react";
import { inject, observer } from "mobx-react";
import MaterialTable from "material-table";
import { DatePicker } from "@material-ui/pickers";
import { formatDateMMDDYYYYfromYYYYMMDD } from "../libs/common";

@inject("store")
@observer
class PaymentsList extends React.Component<{
	store?;
	props?;
	user?;
}> {
	async componentDidMount() {
		await this.props.store.app.fetchUserPayments(this.props.user.corrlinks_id);
	}

	render() {
		const payments = this.props.store.app.payments.filter(
			a => a.corrlinks_id === this.props.user.corrlinks_id
		);
		return (
			<React.Fragment>
				<MaterialTable
					style={{ width: "75%", margin: "0 auto" }}
					options={{
						pageSize: 5,
						search: false
					}}
					isLoading={this.props.store.app.isPaymentsLoading}
					title={`Payments`}
					data={payments}
					columns={[
						{
							title: "id",
							field: "id",
							defaultSort: "desc",
							editable: "never"
						},
						{
							title: "Date Payment Made",
							field: "date_created",
							defaultSort: "desc",
							editable: "always",
							initialEditValue: () => new Date(),
							editComponent: props => (
								<DatePicker value={props.value} onChange={props.onChange} />
							),
							render: props => formatDateMMDDYYYYfromYYYYMMDD(props.date_created)
						},
						{
							title: "Amount",
							field: "amount",
							defaultSort: "desc",
							editable: "always",
							initialEditValue: () => 0
						},
						{
							title: "Comment",
							field: "comment",
							defaultSort: "desc",
							editable: "always"
						}
					]}
				/>
			</React.Fragment>
		);
	}
}

export default PaymentsList;
