import React from "react";
import { inject, observer } from "mobx-react";
import { DatePicker } from "@material-ui/pickers";
import {
	Typography,
	Table,
	TableRow,
	TableCell,
	TextField,
	Button,
	Grid,
	TableBody,
	CircularProgress
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Formik, FormikProps } from "formik";
import { toJS } from "mobx";

@inject("store")
@observer
class PaymentForm extends React.Component<{
	store?;
	props?;
}> {
	state = {
		changesDetected: false,
		busy: false
	};

	async componentDidMount() {
		await this.props.store.app.fetchUsers();
	}

	validate = values => {
		const errors: any = {};
		if (isNaN(parseInt(values.amount, 10)) || values.amount < 0)
			errors.amount = "amount must be >= 0";
		if (
			!(values.date_created instanceof Date) ||
			values.date_created.toString() === "Invalid Date"
		)
			errors.date_created = "invalid date";
		if (
			!(values.date_subscription_ends instanceof Date) ||
			values.date_subscription_ends.toString() === "Invalid Date"
		)
			errors.date_subscription_ends = "invalid date";
		if (!values.corrlinks_id) errors.corrlinks_id = "Invalid id";
		if (
			values.date_created instanceof Date &&
			values.date_subscription_ends instanceof Date &&
			values.date_subscription_ends.valueOf() <= values.date_created.valueOf()
		) {
			errors.date_created = "Subscription End Darte must be after payment date";
		}
		return errors;
	};

	hasChanges = formikProps => {
		if (this.state.changesDetected) return true;
		if (
			JSON.stringify(formikProps.values) !==
			JSON.stringify(formikProps.initialValues)
		) {
			this.setState({ changesDetected: true });
			return true;
		}
		return false;
	};

	onSubmit = async values => {
		this.setState(Object.assign({}, this.state, { busy: true }));
		const result = await this.props.store.app.submitPayment(values);
		this.setState(Object.assign({}, this.state, { busy: false }));

		if (result) {
			const message = {
				type: "success",
				message: "Saved!"
			};
			this.props.store.notifications.addToMessageQueue(message);
		}
	};
	getInitialValues() {
		let date_subscription_ends = new Date();
		date_subscription_ends.setMonth(date_subscription_ends.getMonth() + 1);
		return {
			date_created: new Date(),
			amount: null,
			comment: "",
			corrlinks_id: null,
			date_subscription_ends
		};
	}

	render() {
		const initialValues = this.getInitialValues();
		const onSubmit = this.onSubmit;
		const users = toJS(this.props.store.app.users).sort((a, b) =>
			a["corrlinks_id"] > b["corrlinks_id"] ? 1 : -1
		);

		return (
			<div style={{ width: "500px", margin: "0 auto", textAlign: "center" }}>
				<Typography variant="h5">Enter Payments</Typography>
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					validate={this.validate}
					render={(props: FormikProps<any>) => {
						return (
							<React.Fragment>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Payment Date:</TableCell>
											<TableCell>
												<DatePicker
													required
													fullWidth
													name="date_created"
													value={props.values.date_created}
													onChange={value =>
														props.setFieldValue("date_created", value)
													}
												/>
												{props.errors.date_created &&
													props.touched.date_created && (
														<div>{props.errors.date_created}</div>
													)}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Corrlink User:</TableCell>
											<TableCell>
												{this.props.store.app.isLoading.users && (
													<CircularProgress />
												)}
												{!this.props.store.app.isLoading.users && (
													<Autocomplete
														id="corrlinks_id"
														onChange={e => {
															e.persist();
															const value = e.target["dataset"].value;
															props.setFieldValue("corrlinks_id", value);
														}}
														options={users}
														getOptionLabel={o => `${o.corrlinks_id} ${o.name}`}
														style={{ width: 300 }}
														renderInput={params => (
															<TextField
																{...params}
																name="corrlinks_id"
																variant="standard"
																fullWidth
															/>
														)}
														renderOption={o => {
															return (
																<div
																	data-value={o.corrlinks_id}
																>{`${o.corrlinks_id} ${o.name}`}</div>
															);
														}}
													/>
												)}
												{props.errors.corrlinks_id &&
													props.touched.corrlinks_id && (
														<div>{props.errors.corrlinks_id}</div>
													)}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Amount</TableCell>
											<TableCell>
												<TextField
													required
													fullWidth
													name="amount"
													id="amount"
													value={props.values.amount}
													onChange={props.handleChange}
												/>
												{props.errors.amount && props.touched.amount && (
													<div>{props.errors.amount}</div>
												)}
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
												></TextField>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>New Subscription End Date:</TableCell>
											<TableCell>
												<DatePicker
													required
													fullWidth
													name="date_subscription_ends"
													value={props.values.date_subscription_ends}
													onChange={value =>
														props.setFieldValue("date_subscription_ends", value)
													}
												/>
												{props.errors.date_subscription_ends &&
													props.touched.date_subscription_ends && (
														<div>{props.errors.date_subscription_ends}</div>
													)}
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
													<Button
														variant="outlined"
														onClick={() => window.location.reload()}
													>
														Reset
													</Button>
													{this.state.busy ? (
														<CircularProgress />
													) : (
														<Button
															variant="outlined"
															disabled={
																!(this.hasChanges(props) && props.isValid)
															}
															onClick={(e: any) => props.handleSubmit(e)}
														>
															Save & Next
														</Button>
													)}
												</Grid>
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</React.Fragment>
						);
					}}
				/>
			</div>
		);
	}
}

export default PaymentForm;
