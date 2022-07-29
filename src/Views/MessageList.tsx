import React from "react";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class MessageList extends React.Component<{
	store?;
	props?;
	user?;
}> {
	async componentDidMount() {
		await this.props.store.app.fetchMessages(this.props.user.corrlinks_id);
	}

	render() {
		const messages = this.props.store.app.messages.filter(
			a => a.corrlinks_id === this.props.user.corrlinks_id
		);
		return (
			<React.Fragment>
				<MaterialTable
					style={{ width: "75%", margin: "0 auto" }}
					options={{
						pageSize: 5,
						search: false,
						showTitle: false,
						// toolbar: false,
					}}
					isLoading={this.props.store.app.isMessagesLoading}
					title={`Incoming Messages`}
					data={messages}
					columns={[
						{
							title: "ID",
							field: "corrlinks_id",
							defaultSort: "desc",
							editable: "never"
						},
						{
							title: "MESSAGES FORM",
							field: "from",
							defaultSort: "desc",
							editable: "never",
						},
						{
							title: "SUBJECT",
							field: "subject",
							defaultSort: "desc",
							editable: "never",
						},
						{
							title: "BODY",
							field: "body",
							defaultSort: "desc",
							editable: "never",
						},
                        {
                            title: "STATUS",
                            field: "status",
                            defaultSort: "desc",
                            editable: "never",
                        },
                        {
                            title: "DATE CREATED",
                            field: "date_created",
                            defaultSort: "desc",
                            editable: "never"
                        {
                    ]}
				/>
			</React.Fragment>
		);
	}
}

export default MessageList;

