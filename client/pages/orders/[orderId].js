//  this is /orders/:orderId route
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
	// currentUser prop is from _app.js passed to <Component />
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: "/api/payments",
		method: "post",
		body: {
			orderId: order.id,
		},
		onSuccess: () => Router.push('/orders') // go to /orders after payment
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft(); // to start from 60 , if we dont invoke here timer will start from 59
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, [order]);

	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}

	return (
		<div>
			Time left to pay: {timeLeft} seconds
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51NupNEDSqc0ngge4HRk8js6GswK1p68tg9Z6t22Ny11gAJf2IlR5QXIQIyjrF8lHFOFEfI0rzia9JcWIx8XfMATF00OLPctrWU"
				amount={order.ticket.price}
				email={currentUser.email}
			/>
            {errors}
		</div>
	);
};

// getInitialProp execute before current component load
OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query; // context.querybecause orderId is getting from url [orderId]
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderShow;
