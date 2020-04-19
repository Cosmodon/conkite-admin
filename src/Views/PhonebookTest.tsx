import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Select, MenuItem, Input, Button } from "@material-ui/core";
import { useUserStore, usePhonebookStore } from "../Store/hooks";
import UserStore from "../Store/UserStore";
import { useObserver } from "mobx-react-lite";
import { PhonebookEntry } from "../Store/PhonebookEntry";
import PhonebookStore from "../Store/PhonebookStore";

interface Props {
	corrlinks_id?: string;
}

const setValue = setFn => event => {
	setFn(event.target.value);
};

export const PhonebookTest: React.FC<Props> = props => {
	const [debounce, setDebounce] = useState<String>("");
	const userStore: UserStore = useUserStore();

	const [text, setText] = useState("");
	const [corrlinks_id, setCorrlinks_id] = useState("");
	const [response, setResponse] = useState("null");
	const phonebookStore: PhonebookStore = usePhonebookStore();

	useEffect(() => {
		userStore.fetchUsers();
	}, [userStore]);

	const sendText = async event => {
		const result: any = await phonebookStore.sendTextPhonebook({ corrlinks_id, text, responseRequired: 'EMAIL_TEXT' });
		console.log(result);
		setResponse(result);
	};
	const sendToMessageFromCorrlinks = async event => {
		const result: any = await phonebookStore.sendToMessageFromCorrlinks({ corrlinks_id, text });
		console.log(result);
		setResponse(result);
	};
	const clearResponse = () => setResponse("");
	const addTemplateText = () => setText(TEMPLATE);
	const copyResponse = () => setText(response);

	const getPhonebook = async event => {
		const result: any = await phonebookStore.getPhonebookEmail({ corrlinks_id, });
		console.log(result);
		setResponse(result);
	};

	return useObserver(() => {
		const users = userStore.users.slice().sort((a, b) => (a.name > b.name ? 1 : -1));
		return (
			<>
				<Select onChange={setValue(setCorrlinks_id)} value={corrlinks_id} displayEmpty>
					<MenuItem value="" disabled>
						<em>Select a Corrlinks User</em>
					</MenuItem>
					{users.map((a, i) => {
						return (
							<MenuItem key={i} value={a.corrlinks_id}>
								{a.name} - {a.corrlinks_id}
							</MenuItem>
						);
					})}
				</Select>
				<Button variant="outlined" onClick={addTemplateText}>Add template text</Button>
				<Button variant="outlined" disabled={!corrlinks_id} onClick={getPhonebook}>Get Phonebook email</Button>
				
				<Input style={{border:'1px solid black'}} multiline value={text} onChange={setValue(setText)} rows={20} fullWidth />
				<Button variant="outlined" disabled={!corrlinks_id} onClick={sendText}>Send Phonebook email to process</Button>
				<Button variant="outlined" disabled={!corrlinks_id} onClick={clearResponse}>Clear Response</Button>
				<Button variant="outlined" disabled={!corrlinks_id} onClick={copyResponse}>Copy Response to Text</Button>
				<Button variant="outlined" disabled={!corrlinks_id} onClick={sendToMessageFromCorrlinks}>Send to message-from-corrlinks</Button>
				<div style={{ whiteSpace: "pre" }}>{response}</div>
			</>
		);
	});
};

const TEMPLATE = `This is your Phonebook!

You can add up to 15 entries. Add a friends and family on each line, like so:

1. 01234567890 Joe mobile

When you send back the phonebook, we’ll update our records automatically, and message you back if there are any
problems.

--phonebook start
1.
2. 4242424242 shaun
3. 1234567890 shaun again
4. 0909090909 julia
5.
6.
7.
8.
9.
10.
11.
12.
13.
14.
15.
--phonebook end

PHONEBOOK INSTRUCTIONS
To send an email to a contact in your phonebook, send us the email with their name only in the first line, and your
message on the next lines. For example:

Joe mobile
Hi Joe, this is a test message
Thanks!
Jack

To ADD a contact: enter their mobile number and name into an empty row.
To DELETE a contact: remove their mobile number and name`;