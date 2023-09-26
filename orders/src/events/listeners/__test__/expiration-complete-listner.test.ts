import mongoose, { set } from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@abitickets/common";
import { Message } from "node-nats-streaming";

import { ExpirationCompleteListner } from "../expiration-complete-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	// Create an instance of the listner
	const listner = new ExpirationCompleteListner(natsWrapper.client);

	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const order = Order.build({
		userId: "adsfas",
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	// Create a fake data event
	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};

	// Create a fake message object
	// The following 'ts-ignore' method is used to not show errors by ts even if we don't
	//  implement the message correctly
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	// return all of this stuff
	return { listner, order, ticket, data, msg };
};

it("update the order status to cancelled", async () => {
	const { listner, order, data, msg } = await setup();

	await listner.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
	const { listner, order, data, msg } = await setup();

	await listner.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	// just log if not understand
	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
	const { listner, data, msg } = await setup();

	await listner.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});
