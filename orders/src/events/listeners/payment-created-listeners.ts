import { Message } from "node-nats-streaming";
import {
	Listener,
	Subjects,
	PaymentCreatedEvent,
	OrderStatus,
} from "@abitickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) {
			throw new Error("Order not found");
		}

		order.set({
			status: OrderStatus.Complete,
		});
		await order.save();

		msg.ack();
	}
}

// we need to create instance of NATS streaming server client, and call listan method on those instances in 'index.ts' fils
