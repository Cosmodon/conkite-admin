import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CorrlinksUsers from './CorrlinksUsers';
import PaymentForm from './PaymentForm';
import { inject, observer } from 'mobx-react';
// import LoginForm from './LoginForm';
import API from '../libs/api';
import { Select, MenuItem } from '@material-ui/core';

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}

function a11yProps(index: any) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

@inject("store")
@observer
class SimpleTabs extends React.Component<{
	store?,
	props?,
}>{
	handleChange = () => console.log
	render() {
		const value = this.props.store.location.hash;
		return (
			<div>

				<AppBar position="static">
					<Tabs value={value} aria-label="simple tabs example">
						<Tab label="Login" href="#login" {...a11yProps(0)} />
						<Tab label="Corrlinks Users" href="#corrlinks-users" {...a11yProps(1)} />
						<Tab label="Payment Entry Form" href="#payment-form" {...a11yProps(2)} />
					</Tabs>
				</AppBar>

				<Select
					value={API.getEndpoint()}
					onChange={a => {
						const v = a.target.value as string;
						API.setEndpoint(v);
					}}
				>
					{API.getEndpoints().map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
				</Select>

				{/* <TabPanel value={value} index={'login'}>
					<LoginForm />
				</TabPanel> */}
				<TabPanel value={value} index={'corrlinks-users'}>
					<CorrlinksUsers />
				</TabPanel>
				<TabPanel value={value} index={'payment-form'}>
					<PaymentForm />
				</TabPanel>

			</div>
		);
	}
}

export default SimpleTabs;