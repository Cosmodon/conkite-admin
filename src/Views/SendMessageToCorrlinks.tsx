import React, { useState, useEffect } from "react";
import { Input, Button, TextField } from "@material-ui/core";
import { useUserStore } from "../Store/hooks";
import UserStore from "../Store/UserStore";
import { useObserver } from "mobx-react-lite";
import Autocomplete from "@material-ui/lab/Autocomplete";

interface Props {
	corrlinksId?: string;
}

const setValue = setFn => event => {
	setFn(event.target.value);
};

export const SendMessageToCorrlinks: React.FC<Props> = props => {
	const userStore: UserStore = useUserStore();
	const [body, bodySet] = useState("");
	const [subject, subjectSet] = useState("");
	const [account, accountSet] = useState("");
	const [corrlinksId, corrlinksIdSet] = useState("");

	const onChange = (e, user) => [corrlinksIdSet(user?.corrlinks_id || ""), accountSet(user?.corrlinks_account || "")];
	const clear = () => [bodySet(""), subjectSet(""), accountSet(""), corrlinksIdSet("")];
	const sendText = async () => {
		const result = await userStore.sendMessageToUser({ corrlinksId, subject, body });
		if (result) {
			alert(`message sent`);
			return clear();
		}
		alert(`message failed to send`);
	};

  const isValid = !corrlinksId || !subject || !body;

	useEffect(() => {
		userStore.fetchUsers();
	}, [userStore]);

	return useObserver(() => {  
		const users = userStore.users.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
		return (
			<>
				<Autocomplete
					id="corrlinksId"
					onChange={onChange}
					options={users}
					getOptionLabel={o => `${o.name} ${o.corrlinks_id}`}
					style={{ width: 300 }}
					renderInput={params => <TextField {...params} name="corrlinksId" variant="standard" fullWidth />}
					renderOption={o => <div data-value={o.corrlinks_id}>{`${o.name} ${o.corrlinks_id}`}</div>}
				/>

				<Input style={{ border: "1px solid black" }} placeholder="Subject" value={subject} onChange={setValue(subjectSet)} fullWidth />
				<Input style={{ border: "1px solid black" }} placeholder="from " value={account} disabled fullWidth />
				<Input style={{ border: "1px solid black" }} placeholder="email" value={body} onChange={setValue(bodySet)} rows={20} fullWidth multiline />

				<Button variant="outlined" disabled={isValid} onClick={sendText}>
					Send Message
				</Button>
				<Button variant="outlined" disabled={isValid} onClick={clear}>
					Clear
				</Button>
			</>
		);
	});
};
