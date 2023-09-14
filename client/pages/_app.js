// _app.js is a component file that serves as the "wrapper" or layout for your entire application.
// it  allows you to customize the behavior and appearance of your entire application
// It is a key part of the Next.js framework and is used to define global styles, layouts,elememnts, and to initialize data
//  that should be available across all pages of your application. eg: header,footer,bootstrap styles

// Component refers to the specific page component that is being rendered for a given route in your Next.js application.
//  Each route in your application corresponds to a specific page component.

// pageProps is an object that contains the initial props (short for properties) that
// are passed to the Component when it is rendered.

import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
	return (
		<div>
			<Header currentUser={currentUser} />
			<Component {...pageProps} />
		</div>
	);
};

AppComponent.getInitialProps = async (appContext) => {
	// console.log(Object.keys(appContext));

	const client = buildClient(appContext.ctx);
	const { data } = await client.get("/api/users/currentuser");
	// some pages dont have getInitialProps()
	let pageProps = {};
	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}

	console.log("hi", pageProps);
	return {
		pageProps,
		...data, // data contains currentUser
	};
};

export default AppComponent;
