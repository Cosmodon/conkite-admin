import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import NotesList from "./NotesList";
import PaymentsList from "./PaymentsList";
import MessageForCorrlinks from "./MessageForCorrlinks";
import MessageForSociety from "./MessageForSociety";

export default function PaymentsNotesTabs(props) {
	const [showTab, showTabSet] = useState(1);
	return (
		<>
			<Tabs value={showTab} style={{ width: "75%", margin: "0 auto" }}>
				<Tab value={1} onClick={() => showTabSet(1)} label="Payments"  />
				<Tab value={2} onClick={() => showTabSet(2)} label="Notes" />
				<Tab value={3} onClick={() => showTabSet(3)} label="Messages For Corrlinks" />
				<Tab value={4} onClick={() => showTabSet(4)} label="Messages For Society" />
			</Tabs>
			{showTab === 1 && <PaymentsList user={props.user} />}
			{showTab === 2 && <NotesList user={props.user} />}
			{showTab === 3 && <MessageForCorrlinks user={props.user} />}
			{showTab === 4 && <MessageForSociety user={props.user} />}
		</>
	);
}
