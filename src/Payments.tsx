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
					editable={{
						isEditable: (rowData: any) => false,
						isDeletable: (rowData: any) => false,
						onRowUpdate: (newData, oldData) =>
							new Promise(async (resolve, reject) => {
								const corrlinks_id = oldData.corrlinks_id;
								try {
									validate(newData);
									await this.props.store.app.updateUser({ corrlinks_id, user: newData });
									resolve();
								} catch (e) {
									reject();
								}
							}),
						onRowDelete: oldData =>
							new Promise(async (resolve, reject) => {
								try {
									await this.props.store.app.deleteUser({ corrlinks_id: oldData.corrlinks_id });
									resolve();
								} catch (e) {
									console.log(e);
									alert(e);
									reject();
								}
							}),
						// onRowAdd: newData =>
						// 	new Promise(async (resolve, reject) => {
						// 		try {
						// 			validate(newData);
						// 			await this.props.store.app.addUser({ user: newData });
						// 			resolve();
						// 		} catch (e) {
						// 			console.log(e);
						// 			alert(e)
						// 			reject();
						// 		}
						// 	}),
					}}

				/>

			</React.Fragment>
		);
	}
}
function validate(a) {
	if (!a.corrlinks_id || ('' + a.corrlinks_id).length < 8) throw new Error('corrlinks_id must be 8 digits long');
	if (!a.name || a.name.lengt < 1) throw new Error('name required');
	if (!a.date_subscription_ends || !new Date(a.date_subscription_ends).valueOf()) throw new Error('date_subscription_ends must be a valid date');
	console.log({ a });
	if (!a.status || statuses.filter(b => b.value === a.status).length === 0) throw new Error(`status must be one of [${statuses.map(a => `${a.value}`).join(', ')}]`);
	return true;
}

export default Payments;
