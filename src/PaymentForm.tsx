import React from 'react';
import { inject, observer } from "mobx-react";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Typography, Table, TableRow, TableCell, MenuItem, Select, TextField, TextareaAutosize, Button, Grid, TableBody } from '@material-ui/core';
import { Formik, FormikProps } from 'formik';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';

function ComboBox(props) {
	const { options, labelField, inputProps } = props;
	return (
		<Autocomplete
			id="combo-box-demo"
			options={options}
			getOptionLabel={option => option[labelField]}
			style={{ width: 300 }}
			renderInput={params => (
				<TextField {...params} {...inputProps} label="Corrlinks User" variant="outlined" fullWidth />
			)}
		/>
	);
}

@inject("store")
@observer
class PaymentForm extends React.Component<{
	store?,
	props?,
}>{

	async componentDidMount() {
		// await this.props.store.app.fetchUserPayments(this.props.user.corrlinksId);
	}

	render() {
		let date_subscription_end = new Date();
		date_subscription_end.setMonth(date_subscription_end.getMonth() + 1);
		const initialValues = {
			date_created: new Date(),
			amount: 0,
			comment: '',
			corrlinks_id: null,
			date_subscription_end,
		};
		const onSubmit = console.log;

		return (
			<div style={{ width: '500px', margin: '0 auto', textAlign: 'center' }}>
				<Typography variant="h5">Payment Entry</Typography>
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					render={(props: FormikProps<any>) => {
						return <React.Fragment>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>Payment Date:</TableCell>
										<TableCell>
											<DatePicker
												required
												fullWidth
												name='date_created'
												value={props.values.date_created}
												onChange={value=>props.setFieldValue("date_created", value)}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Corrlink User:</TableCell>
										<TableCell>
											<Select
												required
												fullWidth
												name='corrlinks_id'
												value={props.values.corrlinks_id}
												onChange={props.handleChange}
											>
												{this.props.store.app.users.map(a => <MenuItem value={a.corrlinks_id} key={a.corrlinks_id}>{a.corrlinks_id} - {a.name}</MenuItem>)}
											</Select>

										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Amount</TableCell>
										<TableCell>
											<TextField
												required
												fullWidth
												name="amount"
												value={props.values.amount}
												onChange={props.handleChange}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Comment</TableCell>
										<TableCell>
											<TextField
												fullWidth
												multiline
												rows="3"
												name="comment"
												value={props.values.comment}
												onChange={props.handleChange}
											>
											</TextField>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>New Subscription End Date:</TableCell>
										<TableCell>
											<DatePicker
												required
												fullWidth
												name="date_subscription_end"
												value={props.values.date_subscription_end}
												onChange={value=>props.setFieldValue("date_subscription_end", value)}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={2}>
											<Grid
												container
												direction="row"
												justify="space-between"
												alignItems="center"
											>
												<Button variant="outlined">Close</Button>
												<Button variant="outlined">Save & Close</Button>
												<Button variant="outlined">Save & Next</Button>
											</Grid>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</React.Fragment>
					}
					}
				/>

			</div>
		);
	}
}

export default PaymentForm;
