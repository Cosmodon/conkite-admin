import React from 'react';
import { inject, observer } from "mobx-react";
import MaterialTable from 'material-table';
import { DatePicker } from '@material-ui/pickers';
import { Typography } from '@material-ui/core';
// import { Select, MenuItem } from '@material-ui/core';
import Payments from './PaymentsList';
import { toJS } from 'mobx';

@inject("store")
@observer
class App extends React.Component<{
	store?,
	props?,
}>{

	async componentDidMount() {
		await this.props.store.app.fetchUsers();
	}

	render() {
		const extractDatePart = value => {
			return (new Date(value).toJSON() || '').substr(0, 10);
		}
		const toInt = value => parseInt(extractDatePart(value).split('-').join(''));
		const subscribed = value => {
			let subdate = toInt(value);
			let todaydate = toInt(new Date());
			return todaydate > subdate;
		};
		return (
			<MaterialTable
				isLoading={this.props.store.app.isLoadingUsers}
				title={`Corrlink Users`}
				data={this.props.store.app.users}
				options={{
					pageSize: 10,
					search: true,
					exportButton: true,
					filtering: true,
					sorting: true,
					columnsButton: true,
				}}
				columns={[
					{
						cellStyle: { width: '10%' },
						title: "id",
						field: "corrlinks_id",
						defaultSort: "desc",
						editable: "onAdd",
						type: "numeric", // string with only 0-9, leading 0 allowed
					},
					{
						title: "name",
						field: "name",
						defaultSort: "desc",
						editable: "always",
					},
					{
						title: "subscription end date",
						field: "date_subscription_ends",
						defaultSort: "desc",
						editable: "always",
						initialEditValue: () => {
							return new Date();
						},
						render: props => {
							const color = subscribed(props.date_subscription_ends) ? 'red' : 'green';
							return <Typography style={{ color }}>{new Date(props.date_subscription_ends).toLocaleDateString()}</Typography>;
						},
						editComponent: props => (
							<DatePicker
								value={props.value}
								onChange={props.onChange}
							/>
						)
					},
					{
						title: "Inmate Status",
						field: "date_subscription_ends",
						defaultSort: "desc",
						editable: "never",
						render: props => {
							const color = subscribed(props.date_subscription_ends) ? 'red' : 'green';
							return <Typography style={{ color }}>{color === 'red' ? 'UNPAID' : 'PAID'}</Typography>;
						},
					},
					{
						title: "Prison",
						field: "location",
						defaultSort: "desc",
						editable: "always",
					},
					{
						title: "Release Date",
						field: "date_release",
						defaultSort: "desc",
						editable: "onUpdate",
						render: props => {
							return <Typography>{(!props) ? '-' : props.date_release ? new Date(props.date_release).toLocaleDateString() : '-'}</Typography>;
						},
						editComponent: props => (
							<DatePicker
								value={props.value}
								onChange={props.onChange}
							/>
						)
					},
					// {
					// 	title: "Server Status",
					// 	field: "status",
					// 	defaultSort: "desc",
					// 	editable: "always",
					// 	editComponent: props => (
					// 		<Select
					// 			value={props.value}
					// 			onChange={event => {
					// 				console.log(event);
					// 				return props.onChange(event.target.value);
					// 			}}>
					// 			{statuses.map((a, i) => <MenuItem key={i} value={a.value}>{a.text}</MenuItem>)}
					// 		</Select>
					// 	)
					// },
				]}
				editable={{
					isEditable: (rowData: any) => true,
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
					onRowAdd: newData =>
						new Promise(async (resolve, reject) => {
							try {
								validate(newData);
								await this.props.store.app.addUser({ user: newData });
								resolve();
							} catch (e) {
								console.log(e);
								alert(e)
								reject();
							}
						}),
				}}
				detailPanel={props =>
					<Payments user={toJS(props)} />
				}
			/>
		);
	}
}
function validate(a) {
	if (!a.corrlinks_id || ('' + a.corrlinks_id).length < 8) throw new Error('corrlinks_id must be 8 digits long');
	if (!a.name || a.name.lengt < 1) throw new Error('name required');
	if (!a.date_subscription_ends || !new Date(a.date_subscription_ends).valueOf()) throw new Error('date_subscription_ends must be a valid date');
	return true;
}

export default App;
