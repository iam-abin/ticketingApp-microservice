import { OrderCreatedEvent, OrderStatus } from "@abitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listner
	const listner = new OrderCreatedListener(natsWrapper.client);

	// Create and save a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 99,
		userId: "asdlkjf",
	});
	await ticket.save();

	// Create the fake data event
	const data: OrderCreatedEvent["data"] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: "shdfhsad",
		expiresAt: "dhgshgdl",
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};

	// Create the fake Message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listner, ticket, data, msg };
};

// userId is for locking ticket
it("sets the userId of the ticket", async () => {
	const { listner, ticket, data, msg } = await setup();

	// Call the onMessage fn with the data object + message object
	await listner.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
	const { listner, ticket, data, msg } = await setup();

	// Call the onMessage fn with the data object + message object
	await listner.onMessage(data, msg);

	// Write assertions to make sure ack fn is called!
	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async ()=>{
	const { listner, ticket, data, msg } = await setup();

	// Call the onMessage fn with the data object + message object
	await listner.onMessage(data, msg);

	// Write assertions to make sure ack fn is called!
	expect(natsWrapper.client.publish).toHaveBeenCalled();
})