import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import { inject, observer } from "mobx-react";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

function TransitionUp(props) {
	return <Slide {...props} direction="up" />;
}
const styles = {
	success: {
		backgroundColor: 'green'
	},
	info: {
		backgroundColor: 'lightblue'
	},
	warning: {
		backgroundColor: 'orange'
	},
	error: {
		backgroundColor: 'red'
	},
};

const variantIcon = {
	success: CheckCircleIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
};

@inject("store")
@observer
class MessageSnackbar extends React.Component<{
	store?,
	props?,
}> {

	handleClick = () => {
		this.props.store.notifications.popFromMessageQueue();
	};

	handleClose = () => {
		this.props.store.notifications.popFromMessageQueue();
	};

	render() {
		const queueItem = this.props.store.notifications.getFromMessageQueue();
		if (!queueItem) return '';
		const Icon = variantIcon[queueItem.type];
		const { message, type } = queueItem;
		const typeText = type === 'success' ? '' : (type.charAt(0).toUpperCase() + type.substr(1)+': ');

		return (
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={true}
				onClose={this.handleClose}
				TransitionComponent={TransitionUp}
				ContentProps={{ 'aria-describedby': 'message-id' }}>
				<SnackbarContent
					style={styles[type]}
					message={
						<span id="client-snackbar" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
							<Icon style={{ opacity: 0.9, marginRight: 8 }} />
							{typeText}{message}
						</span>
					}
					action={[
						<IconButton key="close" aria-label="close" color="inherit" onClick={this.handleClose}>
							<CloseIcon style={{ fontSize: 20 }} />
						</IconButton>,
					]}>
				</SnackbarContent>
			</Snackbar>
		);
	}
}

export default MessageSnackbar;