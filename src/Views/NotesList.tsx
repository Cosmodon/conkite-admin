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
		await this.props.store.app.fetchUserNotes({ corrlinks_id: this.props.user.corrlinks_id });
	}

	render() {
		const notes = this.props.store.app.notes.filter(a => a.corrlinks_id === this.props.user.corrlinks_id);
		const onRowAddHandler = async newData => {
			await this.props.store.app.addUserNote({ corrlinks_id: this.props.user.corrlinks_id, note: newData.note });
		};
		const onRowDeleteHandler = async data => {
			await this.props.store.app.deleteUserNote({ corrlinks_id: this.props.user.corrlinks_id, note_id: data.id });
		}

		return (
			<React.Fragment>
				<MaterialTable
					style={{ width: "75%", margin: "0 auto" }}
					options={{
						// 	pageSize: 5,
						search: false,
						showTitle: false,
						// 	toolbar: false,
						columnsButton: true
					}}
					isLoading={this.props.store.app.isNotesLoading}
					title={`Notes`}
					data={notes}
					columns={[
						{
							title: "id",
							field: "id",
							defaultSort: "desc",
							editable: "never"
						},
						{
							title: "Note",
							field: "note",
							editable: "onAdd"
						},
						{
							title: "Date Created",
							field: "date_created",
							defaultSort: "desc",
							editable: "never"
						}
					]}
					editable={{
						onRowAdd: onRowAddHandler,
						onRowDelete: onRowDeleteHandler
					}}
				/>
			</React.Fragment>
		);
	}
}

export default NotesList;
