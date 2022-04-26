import React from "react";
import { inject, observer } from "mobx-react";
import { DatePicker } from "@material-ui/pickers";
import {
	Typography,
	Table,
	TableRow,
	TableCell,
	MenuItem,
	Select,
	TextField,
	Button,
	Grid,
	TableBody,
	CircularProgress
} from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import { toJS } from "mobx";

@inject("store")
@observer
class LoginForm extends React.Component<{
	store?;
	props?;
}> {
	state = {
		changesDetected: false
	};

	async componentDidMount() {
		// await this.props.store.app.fetchUsers();
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
		const result = await this.props.store.app.submitPayment(values);
		if (result) {
			const message = {
				type: "success",
				message: "Saved!"
			};
			this.props.store.notifications.addToMessageQueue(message);
		}
	};
	getInitialValues() {
		return {
			email: "",
			password: ""
		};
	}

	render() {
		const initialValues = this.getInitialValues();
		const onSubmit = this.onSubmit;

		return (
			<div style={{ width: "500px", margin: "0 auto", textAlign: "center" }}>
				<Typography variant="h5">Login</Typography>
				<br />
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
											<TableCell>email:</TableCell>
											<TableCell>
												<TextField
													autoComplete="email"
													fullWidth
													InputProps={{ type: "email" }}
													name="email"
													value={props.values.email}
													onChange={props.handleChange}
												></TextField>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell>password:</TableCell>
											<TableCell>
												<TextField
													autoComplete="password"
													fullWidth
													InputProps={{ type: "password" }}
													name="password"
													value={props.values.password}
													onChange={props.handleChange}
												></TextField>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={2}>
												<br />

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
													<Button
														variant="contained"
														color="primary"
														disabled={false}
														onClick={(e: any) => props.handleSubmit(e)}
													>
														Login
													</Button>
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

export default LoginForm;
