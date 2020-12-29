import React from "react";
import { inject, observer } from "mobx-react";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Table, TableRow, TableCell, TextField, Button, Grid, TableBody, CircularProgress, Select, MenuItem } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Formik, FormikProps } from "formik";
import { toJS } from "mobx";

const MESSAGING = 2;
// const PHONEBOOK = 3;
const ADHOC = 4;

@inject("store")
@observer
class PaymentForm extends React.Component<{
	store?;
	props?;
}> {
	state = {
		busy: false,
		initialValues: this.getInitialValues(),
		users: [],
		usersIdx: {},
		products: [],
		productsIdx: {}
	};

	async componentDidMount() {
		// load users
		await this.props.store.app.fetchUsers();
		const users = toJS(this.props.store.app.users).sort((a, b) => (a["corrlinks_id"] > b["corrlinks_id"] ? 1 : -1));
		const usersIdx = users.reduce((a, c) => Object.assign(a, { [c.corrlinks_id]: c }), {});
		this.setState({ users, usersIdx });

		// load products
		await this.props.store.app.fetchProducts();
		const productsIdx = {};
		toJS(this.props.store.app.products).forEach(product => (productsIdx[product.product_id] = product));
		this.setState({ products: this.props.store.app.products, productsIdx });
	}

	validate = values => {
		const errors: any = {};
		if (isNaN(parseInt(values.amount, 10)) || values.amount < 0) errors.amount = "amount must be >= 0";
		if (!(values.date_created instanceof Date) || values.date_created.toString() === "Invalid Date") errors.date_created = "invalid date";
		// if (
		// 	!(values.date_subscription_ends instanceof Date) ||
		// 	values.date_subscription_ends.toString() === "Invalid Date"
		// )
		// 	errors.date_subscription_ends = "invalid date";
		if (!values.corrlinks_id) errors.corrlinks_id = "Invalid id";
		// if (
		// 	values.date_created instanceof Date &&
		// 	values.date_subscription_ends instanceof Date &&
		// 	values.date_subscription_ends.valueOf() <= values.date_created.valueOf()
		// ) {
		// 	errors.date_created = "Subscription End Darte must be after payment date";
		// }
		return errors;
	};

	hasChanges = formikProps => {
		return JSON.stringify(formikProps.values) !== JSON.stringify(formikProps.initialValues);
	};

	onSubmit = async (values, props) => {
		this.setState(Object.assign({}, this.state, { busy: true }));
		let result;
		switch (values.product_type) {
			case ADHOC:
				result = await this.props.store.app.submitPayment(values);
				break;
			case MESSAGING:
				result = await this.props.store.app.submitPurchase(values);
				break;
			default:
				break;
		}
		this.setState(Object.assign({}, this.state, { busy: false }));

		if (result) {
			const message = {
				type: "success",
				message: "Saved!"
			};
			this.props.store.notifications.addToMessageQueue(message);
		}

		Object.assign(this.state.initialValues, values);
	};
	getInitialValues() {
		let date_subscription_ends = new Date();
		date_subscription_ends.setMonth(date_subscription_ends.getMonth() + 1);
		return {
			date_created: new Date(),
			amount: 0,
			comment: "",
			corrlinks_id: "",
			date_subscription_ends: null,
			product_type: 4, // adhoc
			product_instance_id: 0
		};
	}

	getCurrentSubEndDate(corrlinks_id) {
		const { usersIdx } = this.state;
		const user = usersIdx[corrlinks_id];
		if (!corrlinks_id || !user) {
			return "-";
		}
		const date = new Date(usersIdx[corrlinks_id].date_subscription_ends);
		return date.toLocaleDateString();
	}

	render() {
		const { users } = this.state;

		return (
			<div style={{ width: "500px", margin: "0 auto", textAlign: "center" }}>
				<Typography variant="h5">Enter Payments</Typography>
				<Formik enableReinitialize initialValues={this.state.initialValues} onSubmit={this.onSubmit} validate={this.validate}>
					{(props: FormikProps<any>) => {
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
													onChange={value => props.setFieldValue("date_created", value)}
												/>
												{props.errors.date_created && props.touched.date_created && <div>{props.errors.date_created}</div>}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Corrlink User:</TableCell>
											<TableCell>
												{this.props.store.app.isLoading.users && <CircularProgress />}
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
														renderInput={params => <TextField {...params} name="corrlinks_id" variant="standard" fullWidth />}
														renderOption={o => {
															return <div data-value={o.corrlinks_id}>{`${o.corrlinks_id} ${o.name}`}</div>;
														}}
													/>
												)}
												{props.errors.corrlinks_id && props.touched.corrlinks_id && <div>{props.errors.corrlinks_id}</div>}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Current Sub End Date:</TableCell>
											<TableCell>{this.getCurrentSubEndDate(props.values.corrlinks_id)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Amount</TableCell>
											<TableCell>
												<TextField required fullWidth name="amount" id="amount" value={props.values.amount} onChange={props.handleChange} />
												{props.errors.amount && props.touched.amount && <div>{props.errors.amount}</div>}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>Product</TableCell>
											<TableCell>
												<Select
													style={{ textTransform: "capitalize" }}
													required
													fullWidth
													name="product_type"
													id="product_type"
													value={props.values.product_type}
													onChange={props.handleChange}
												>
													{this.state.products.map(product => (
														<MenuItem key={product.product_id} value={product.product_id} style={{ textTransform: "capitalize" }}>
															{product.product_name}
														</MenuItem>
													))}
												</Select>
											</TableCell>
										</TableRow>

										{props.values.product_type === ADHOC && (
											<>
												<TableRow>
													<TableCell>New Subscription End Date:</TableCell>
													<TableCell>
														<DatePicker
															fullWidth
															name="date_subscription_ends"
															value={props.values.date_subscription_ends}
															onChange={value => props.setFieldValue("date_subscription_ends", value)}
														/>
														{props.errors.date_subscription_ends && props.touched.date_subscription_ends && (
															<div>{props.errors.date_subscription_ends}</div>
														)}
													</TableCell>
												</TableRow>
											</>
										)}

										{props.values.product_type === MESSAGING && (
											<>
												<TableRow>
													<TableCell>Months</TableCell>
													<TableCell>
														<Select
															style={{ textTransform: "capitalize" }}
															required
															fullWidth
															name="product_instance_id"
															id="product_instance_id"
															value={props.values.product_instance_id}
															onChange={props.handleChange}
														>
															{this.state.productsIdx[MESSAGING].instances.map(product_instance => (
																<MenuItem
																	key={`product_instance_id-${product_instance.product_instances_id}`}
																	value={product_instance.product_instances_id}
																	style={{ textTransform: "capitalize" }}
																>
																	{product_instance.months}
																</MenuItem>
															))}
														</Select>
													</TableCell>
												</TableRow>
											</>
										)}

										<TableRow>
											<TableCell>Comment</TableCell>
											<TableCell>
												<TextField fullWidth multiline rows="3" name="comment" value={props.values.comment} onChange={props.handleChange}></TextField>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={2}>
												<Grid container direction="row" justify="space-between" alignItems="center">
													<Button variant="outlined" onClick={() => window.location.reload()}>
														Reset
													</Button>
													{this.state.busy ? (
														<CircularProgress />
													) : (
														<Button
															variant="outlined"
															disabled={!(this.hasChanges(props) && props.isValid)}
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
				</Formik>
			</div>
		);
	}
}

export default PaymentForm;
