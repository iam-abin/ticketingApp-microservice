import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketUpdatedEvent } from "@abitickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListner extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;
	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const { id, title, price } = data;
		const ticket = await Ticket.findById(id);

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