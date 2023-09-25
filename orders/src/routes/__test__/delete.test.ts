import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";

it("Mark an order as cancelled", async () => {
	// Create a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 20,
	});

	await ticket.save();

	const user = global.signin();
	// Make request to build an order with this ticket
	const { body: order } = await request(app)
		.post("/api/orders")
		.set("Cookie", user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// Make request to cancel the order
	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set("Cookie", user)
		.send()
		.expect(204);

	// expectation to make sure that ticket is cancelled
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it.todo('emits a order cancelled event')