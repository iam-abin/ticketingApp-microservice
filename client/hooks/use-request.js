import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async (props = {}) => {
		// sometimes doRequest receves a property to send with request
		try {
			setErrors(null); // to remove previous error message
			const response = await axios[method](url, { ...body, ...props });
			
			if (onSuccess) {
				onSuccess(response.data);
			}

			return response.data;
		} catch (err) {
			setErrors(
				<div className="alert alert-danger">
					<h4>Oops...!</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest, errors };
};
