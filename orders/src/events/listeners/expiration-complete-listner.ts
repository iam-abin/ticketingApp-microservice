import {
	Listener,
	ExpirationCompleteEvent,
	Subjects,
	OrderStatus,
} from "@abitickets/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListner extends Listener<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;
	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {

		const order = await Order.findById(data.orderId).populate('ticket');

		if (!order) {
			throw new Error("order not found");
		}

		// if order is complete then return ack no need to go to downwards
		if(order.status === OrderStatus.Complete){
			return msg.ack()
		}

		order.set({
			status: OrderStatus.Cancelled,
		});
		await order.save();

		// we need to tell the other subscribed services that the order has been cancelled
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
	}
}
