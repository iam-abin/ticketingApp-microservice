import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@abitickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListner extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {

		// 'findByEvent' defined inside ticket model checks incomming ie, published 'version-1' exist to solves concurrency issue

		// when an event come in 'out of order' of version we always going 
		// to bounce the outof order event -> process the correct on -> the eventually reissues 
		// the bounced one after 5 seconds and apply it to the database
		const { id, title, price } = data;
		const ticket = await Ticket.findByEvent(data)

		if (!ticket) {
			throw new Error("Ticket not found");
		}
		// to update a ticket
		ticket.set({ title, price });
		await ticket.save();

        msg.ack();
	}
}


// we need to create instance of NATS streaming server client, and call listan method on those instances in 'index.ts' fils