import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@abitickets/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        const { id, title, price} = data;

        // id of a ticket on every service should be same when we create it
        const ticket =Ticket.build({
            id, 
            title,
            price
        })
        await ticket.save()

        msg.ack();
    }

}

// we need to create instance of NATS streaming server client, and call listan method on those instances in 'index.ts' fils
