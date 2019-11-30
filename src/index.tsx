import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import AppStore from './Store/AppStore';
import { Provider } from "mobx-react";
import { ThemeProvider } from "@material-ui/styles";
import theme from './libs/theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export const store = {
	app: new AppStore(),
}

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<App />
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
