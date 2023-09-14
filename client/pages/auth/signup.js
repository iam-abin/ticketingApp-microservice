import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { doRequest, errors } = useRequest({
		url: "/api/users/signup",
		method: "post",
		body: {
			email,
			password,
		},
		onSuccess: () => Router.push("/"),
	});

	const submitHandler = async (e) => {
		e.preventDefault();

		await doRequest();
	};

	return (
		<form onSubmit={submitHandler}>
			<h1>Sign Up</h1>
			<div className="form-group">
				<label>Email</label>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control"
					type="text"
				/>
			</div>
			<div className="form-group">
				<label>Password</label>
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="form-control"
					type="password"
				/>
			</div>
			<br />
			{errors}

			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
};
