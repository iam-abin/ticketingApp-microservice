import { useEffect } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

// signout request should make from browser, not from server side of nextjs
export default () => {
	const { doRequest } = useRequest({
		url: "/api/users/signout",
		method: "post",
		body: {},
		onSuccess: () => Router.push("/"),
	});

	useEffect(() => {
		doRequest();
	}, []);
	return <div>Signing you out...</div>;
};
