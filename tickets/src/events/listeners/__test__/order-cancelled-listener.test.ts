import { OrderCancelledEvent, OrderStatus } from "@abitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listner
	const listner = new OrderCancelledListener(natsWrapper.client);

	// Create and save a ticket
	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: "concert",
		price: 99,
		userId: "asdlkjf",
	});
	ticket.set({orderId})
	await ticket.save();

	// Create the fake data event
	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// Create the fake Message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listner, ticket, data, msg, orderId };
};

// userId is for locking ticket
it("update the ticket, publish an event , and ack the message", async () => {
	const  { listner, ticket, data, msg, orderId } = await setup();

	// Call the onMessage fn with the data object + message object
	await listner.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).not.toBeDefined();
	// Write assertions to make sure ack fn is called!
	expect(msg.ack).toHaveBeenCalled();
	// Write assertions to make sure publish fn is called!
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
