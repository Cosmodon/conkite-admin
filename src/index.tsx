import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "mobx-react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./libs/theme";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MessageSnackbar from "./Views/MessageSnackbar";

import AppStore from "./Store/AppStore";
import LocationStore from "./Store/LocationStore";
import NotificationStore from "./Store/NotificationStore";

export const store = {
	app: new AppStore(),
	location: new LocationStore(),
	notifications: new NotificationStore()
};

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<App />
				<MessageSnackbar />
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
