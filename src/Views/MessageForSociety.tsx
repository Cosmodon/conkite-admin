import React from "react";
import { inject, observer } from "mobx-react";
import MaterialTable from "material-table";

@inject("store")
@observer
class NotesList extends React.Component<{
	store?;
	props?;
	user?;
}> {
	async componentDidMount() {
		await this?.props?.store?.app?.fetchMessagesForSociety?.({ corrlinks_id: this.props.user.corrlinks_id });
	}

	render() {
		const messages = this?.props?.store?.app?.messagesForSociety?.filter?.(a => a.corrlinks_id === this.props.user.corrlinks_id);

		return (
			<React.Fragment>
				<MaterialTable
					style={{ width: "75%", margin: "0 auto" }}
					options={{
						search: true,
            filtering: true,
						showTitle: false,
						columnsButton: true
					}}
					isLoading={this.props.store.app.isLoading.messagesForSociety}
					title={`Messages For Society`}
					data={messages}
					columns={[
						{
							title: "id",
							field: "id",
							defaultSort: "desc",
						},
						{
							title: "Mobile Number",
							field: "mobile_number",
						},
						{
							title: "Subject",
							field: "subject",
						},
						{
							title: "Body",
							field: "body",
						},
						{
							title: "Status",
							field: "status",
						},
						{
							title: "Date Created",
							field: "date_created",
						},
						{
							title: "Corrlinks Account",
							field: "corrlinks_account",
						},
					]}
				/>
			</React.Fragment>
		);
	}
}

export default NotesList;
