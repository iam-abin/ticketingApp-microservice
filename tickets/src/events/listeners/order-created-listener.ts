import { Message } from "node-nats-streaming";
import { Listener, Subjects, OrderCreatedEvent } from "@abitickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		// Find the ticket that the order is reserving
		const ticket = await Ticket.findById(data.ticket.id);

		// If no ticket, throw error
		if (!ticket) {
			throw new Error("Ticket Not Found");
		}

		// Mark the ticket as being reserved by setting its order property
        ticket.set({orderId: data.id})

		// Save the ticket
        await ticket.save();

        // publish a ticket updated event, ie, we added orderId for locking, to ticket
        // 'this.client' is from common modules Listner
        await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			version: ticket.version,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId
		})

		// ack the message
        msg.ack()
	}
}

// we need to create instance of NATS streaming server client, and call listan method on those instances in 'index.ts' fils
