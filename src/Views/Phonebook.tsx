import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { CircularProgress, TextField } from "@material-ui/core";
import { useUserStore, usePhonebookStore } from "../Store/hooks";
import UserStore from "../Store/UserStore";
import { useObserver } from "mobx-react-lite";
import { PhonebookEntry } from "../Store/PhonebookEntry";
import PhonebookStore from "../Store/PhonebookStore";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface Props {
	corrlinks_id?: string;
}

const PhonebookUI: React.FC<Props> = props => {
	const [selectedUser, setUser] = useState<String>(props.corrlinks_id || "");
	const [debounce, setDebounce] = useState<String>("");
	const userStore: UserStore = useUserStore();
	const phonebookStore: PhonebookStore = usePhonebookStore();

	useEffect(() => {
		if (selectedUser && selectedUser !== debounce) {
			phonebookStore.fetchPhonebookEntries(selectedUser);
			setDebounce(selectedUser);
		}
	});
	useEffect(() => {
		userStore.fetchUsers();
	}, [userStore]);

	return useObserver(() => {
		const users = userStore.users.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
		const usersIdx = users.reduce((a, c) => Object.assign(a, { [c.corrlinks_id]: c }), {});

		return (
			<React.Fragment>
				{userStore.isLoading && <CircularProgress />}
				{
					<Autocomplete
						id="corrlinks_id"
						onChange={(e, user) => setUser(user ? user.corrlinks_id : "")}
						options={users}
						getOptionLabel={o => `${o.name} ${o.corrlinks_id}`}
						style={{ width: 500 }}
						renderInput={params => <TextField {...params} name="corrlinks_id" variant="standard" fullWidth />}
						renderOption={o => <div data-value={o.corrlinks_id}>{`${o.name} ${o.corrlinks_id}`}</div>}
					/>
				}
				{selectedUser && (
					<MaterialTable
						isLoading={phonebookStore.isLoading}
						title={`Phonebook: ${usersIdx["" + selectedUser]?.name || "UNKNOWN"}`}
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
						editable={{
							isEditable: (rowData: any) => true,
							onRowUpdate: (newData, oldData) =>
								new Promise(async (resolve, reject) => {
									const corrlinks_id = selectedUser;
									try {
										const entry: PhonebookEntry = new PhonebookEntry(newData);
										const errors: Array<String> = entry.validate();
										if (errors.length) {
											alert(errors.join("\n"));
											return reject();
										}
										const saved = await phonebookStore.updatePhonebookEntry({ corrlinks_id, entry });
										saved ? resolve() : reject();
									} catch (e) {
										reject();
									}
								}),
							onRowDelete: oldData =>
								new Promise(async (resolve, reject) => {
									const corrlinks_id = selectedUser;
									const entry: PhonebookEntry = new PhonebookEntry(oldData);
									entry.label = "";
									entry.mobile = "";
									try {
										const saved = await phonebookStore.updatePhonebookEntry({ corrlinks_id, entry });
										saved ? resolve() : reject();
									} catch (e) {
										reject();
									}
								})
						}}
					/>
				)}
			</React.Fragment>
		);
	});
};

export default PhonebookUI;
