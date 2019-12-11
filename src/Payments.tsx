import React from 'react';
import { inject, observer } from "mobx-react";
import MaterialTable from 'material-table';
import { DatePicker } from '@material-ui/pickers';

const statuses = ['TRIAL', 'BLOCKED', 'LIVE'].map(a => ({ value: a, text: a }));

@inject("store")
@observer
class Payments extends React.Component<{
	store?,
	props?,
	user?,
}>{

	async componentDidMount() {
		await this.props.store.app.fetchUserPayments(this.props.user.corrlinksId);
	}

	render() {
		return (
			<React.Fragment>

				<MaterialTable
					style={{width:'75%', margin:'0 auto'}}
					options={{
						pageSize: 5,
						search: false,
						
					}}
					isLoading={this.props.store.app.isPaymentsLoading}
					title={`Payments`}
					data={this.props.store.app.payments}
					columns={[
						{
							title: "id",
							field: "id",
							defaultSort: "desc",
							editable: "never",
						},
						{
							title: "Date Payment Made",
							field: "date",
							defaultSort: "desc",
							editable: "always",
							initialEditValue: () => new Date(),
							editComponent: props => (
								<DatePicker
									value={props.value}
									onChange={props.onChange}
								/>
							)
						},
						{
							title: "Amount",
							field: "amount",
							defaultSort: "desc",
							editable: "always",
							initialEditValue: () => 0,
						},
						{
							title: "Comment",
							field: "comment",
							defaultSort: "desc",
							editable: "always",
						},
					]}
				/>

			</React.Fragment>
		);
	}
}

export default Payments;
