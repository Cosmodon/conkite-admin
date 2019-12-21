import React from 'react';
import { inject, observer } from "mobx-react";
import MenuTabs from './Views/MenuTabs';

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
		return <MenuTabs />;
	}
}

export default App;
