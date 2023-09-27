//  this is /tickets/new route

import { useState } from "react";
import Router from "next/router"
import useRequest from "../../hooks/use-request";

const newTicket = () => {
	const [title, setTitle] = useState("");
	const [price, setPrice] = useState("");

	const { doRequest, errors } = useRequest({
		url: "/api/tickets",
		method: "post",
		body: {
			title,
			price,
		},
		onSuccess: () => Router.push('/'),
	});

	const onBlur = () => {
		const value = parseFloat(price); // it gives NaN if we enter a alphanumeric

		if (isNaN(value)) {
			return; // dont do anything
		}

		setPrice(value.toFixed(2)); // changed to 2 decimal points if there is more than 2
	};

	const submitHandler = (e) => {
		e.preventDefault();
		doRequest();
	};

	return (
		<div>
			<h1>Create a ticket</h1>
			<form onSubmit={submitHandler}>
				<div className="form-group">
					<label>Title</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control"
					/>
				</div>

				<div className="form-group">
					<label>Price</label>
					<input
						type="text"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						onBlur={onBlur}
						className="form-control"
					/>
				</div>
				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default newTicket;
