// This is a landing page
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link  href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
						View
					</Link>
				</td>
			</tr>
		);
	});
	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
	// we cannot use useRequest hook here because this fn is for server side rendering. useRequest hook can use only on components

	// buildClient() returns an axios instance ,and we can chain it to make requests

	// When you define a getInitialProps function in a Next.js page component, Next.js automatically provides the
	// context object as a parameter to that function. This context object contains various information about the
	// current request, such as the request headers, query parameters
	const { data } = await client.get("/api/tickets");

	return { tickets: data }; // this ticket will go as LabtingPage's arg
};

export default LandingPage;
