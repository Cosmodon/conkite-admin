import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Select, MenuItem } from "@material-ui/core";
import { useUserStore, usePhonebookStore } from "../Store/hooks";
import UserStore from "../Store/UserStore";
import { useObserver } from "mobx-react-lite";
import { PhonebookEntry } from "../Store/Phonebook";
import PhonebookStore from "../Store/PhonebookStore";

interface Props {
	corrlinks_id?: string;
}

const PhonebookUI: React.FC<Props> = props => {
	const [selectedUser, setUser] = useState<String>(props.corrlinks_id || "");
	const [debounce, setDebounce] = useState<String>("");
	const userStore: UserStore = useUserStore();
	const phonebookStore: PhonebookStore = usePhonebookStore();

	useEffect(() => {
		if (selectedUser && (selectedUser!==debounce)) {
			phonebookStore.fetchPhonebookEntries(selectedUser);
			setDebounce(selectedUser);
		}
	});

	return useObserver(() => {
		const users = userStore.users.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
		const usersIdx = users.reduce((a, c) => Object.assign(a, { [c.corrlinks_id]: c }), {});


		return (
			<React.Fragment>
				<Select onChange={e => setUser("" + e.target.value)} value={selectedUser} displayEmpty>
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
						isLoading={userStore.isLoading}
						title={`Phonebook: ${usersIdx["" + selectedUser]?.name || 'UNKNOWN'}`}
						data={phonebookStore.entries}
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
								defaultSort: "asc",
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
								isEditable: (rowData: any) => true,
								onRowUpdate: (newData, oldData) =>
									new Promise(async (resolve, reject) => {
										const corrlinks_id = oldData.corrlinks_id;
										try {
											const entry: PhonebookEntry = new PhonebookEntry(newData);
											if (!entry.isValid()){
												alert(entry.errors.join('\n'));
												reject();
											}
											// await phonebookStore.updatePhonebookEntry({corrlinks_id, entry});
											resolve();
										} catch (e) {
											reject();
										}
									})
							}
						}
					/>
				)}
			</React.Fragment>
		);
	});
};

export default PhonebookUI;
