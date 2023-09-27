import axios from "axios";

export default ({ req }) => {
	if (typeof window === "undefined") {
		// we are on the server
		// request should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local  to
		//  go to ingress-nginx namespace

		return axios.create({
			baseURL:
				"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",

			// we need to set cookie and host as headers(included in req.header), otherwise like browser, server do
			// not attach them with request from server by default
			headers: req.headers,
		});
		// return data;
	} else {
		// we are on the browser
		// request can be made with a base url.(browser will put the base url)
		return axios.create({
			baseURL: "/",
		});
	}
};
