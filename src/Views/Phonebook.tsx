import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Select, MenuItem } from "@material-ui/core";
import { useUserStore } from "../Store/hooks";
import UserStore from "../Store/UserStore";
import { useObserver } from "mobx-react-lite";

class PhonebookEntry {
	line_id: number;
	label: string;
	mobile: string;
}

class Phonebook {
	entries: Array<PhonebookEntry> = [];
}

interface Props {
	corrlinks_id?: string;
}

const PhonebookUI: React.FC<Props> = props => {
	const [selectedUser, setUser] = useState<String>("");
	const store: UserStore = useUserStore();
	let phonebook: Phonebook[] = [];

	useEffect(() => {});

	return useObserver(() => {
		const users = store.users
			.slice()
			.sort((a, b) => (a.name > b.name ? 1 : -1));

		return (
			<React.Fragment>
				<Select
					onChange={e => setUser("" + e.target.value)}
					value={selectedUser}
					displayEmpty
				>
					<MenuItem value="" disabled>
						<em>Select a Corrlinks User</em>
					</MenuItem>
					{users.map((a, i) => {
						return (
							<MenuItem key={i} value={a.corrlinks_id}>
								{a.name}
							</MenuItem>
						);
					})}
				</Select>
				{selectedUser !== "" && (
					<MaterialTable
						// isLoading={this.props.store.app.isLoadingUsers}
						title={`Phonebook`}
						data={phonebook}
						options={{
							pageSize: 15,
							// exportButton: true,
							// filtering: true,
							sorting: true
							// columnsButton: true
						}}
						columns={[
							{
								title: "line",
								field: "line_id",
								defaultSort: "desc",
								editable: "never"
							},
							{
								title: "label",
								field: "label",
								defaultSort: "asc",
								editable: "always"
							},
							{
								title: "mobile",
								field: "mobile",
								editable: "always"
							}
						]}
						editable={
							{
								// isEditable: (rowData: any) => true,
								// onRowUpdate: (newData, oldData) =>
								// 	new Promise(async (resolve, reject) => {
								// 		const corrlinks_id = oldData.corrlinks_id;
								// 		try {
								// 			validate(newData);
								// 			await this.props.store.app.updateUser({
								// 				corrlinks_id,
								// 				user: newData
								// 			});
								// 			resolve();
								// 		} catch (e) {
								// 			reject();
								// 		}
								// 	})
							}
						}
					/>
				)}
			</React.Fragment>
		);
	});
};

export default PhonebookUI;
