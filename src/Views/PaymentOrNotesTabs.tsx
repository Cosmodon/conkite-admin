import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import NotesList from "./NotesList";
import PaymentsList from "./PaymentsList";


export default function PaymentsNotesTabs (props){
	const [showPayments, showPaymentsSet] = useState(0);
	return <>
	  <Tabs value={showPayments} style={{ width: "75%", margin: "0 auto" }}>
	    <Tab label="Payments" value={0} onClick={(e)=>showPaymentsSet(0)} />
	    <Tab label="Notes" value={1} onClick={(e)=>showPaymentsSet(1)} />
	  </Tabs>
		{!showPayments ? <PaymentsList user={props.user} /> : <NotesList user={props.user} />}
	</>;
}
