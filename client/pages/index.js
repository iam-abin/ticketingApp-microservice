// This is a landing page
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
	return currentUser ? (
		<h1>You are signed in</h1>
	) : (
		<h1>You are NOT signed in</h1>
	);
};

LandingPage.getInitialProps = async (context) => {
	// we cannot use useRequest hook here because this fn is for server side rendering. useRequest hook can use only on components
	// console.log(req.headers);

	// buildClient() returns an axios instance ,and we can chain it to make requests

	// When you define a getInitialProps function in a Next.js page component, Next.js automatically provides the
	// context object as a parameter to that function. This context object contains various information about the
	console.log("LANDING PAGE");
	// current request, such as the request headers, query parameters
	const client = buildClient(context);
	const { data } = await client.get("/api/users/currentuser");
	return data;
};

export default LandingPage;
