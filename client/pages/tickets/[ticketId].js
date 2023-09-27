//  this is /tickets/:ticketId route
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
	const { doRequest, errors } = useRequest({
		url: "/api/orders",
		method: "post",
		body: {
			ticketId: ticket.id,
		},
		onSuccess: (order) =>
			Router.push("/orders/[orderId]", `/orders/${order.id}`),
	});
	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>price: {ticket.price}</h4>
			{errors}
			<button onClick={()=> doRequest()} className="btn btn-primary">
				Purchase
			</button>
		</div>
	);
};

// context get values when we navigate form another page to here
TicketShow.getInitialProps = async (context, client) => {
	const { ticketId } = context.query; // context.querybecause ticketId is getting from url [ticketId]
	const { data } = await client.get(`/api/tickets/${ticketId}`);

	return { ticket: data }; // passed to TicketShow's arg
};

export default TicketShow;
