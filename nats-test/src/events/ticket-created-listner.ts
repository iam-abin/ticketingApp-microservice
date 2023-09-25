import { Message } from "node-nats-streaming";
import { Listener } from "./base-listner";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated  // it can also write as 'subject: Subjects.TicketCreated  = Subjects.TicketCreated' 
	queueGroupName = "payments-service";

	onMessage(data: TicketCreatedEvent['data'], msg: Message) { // here data is of type " 'data' property of 'TicketCreatedEvent' interface"
		console.log("Event data!",data);

		console.log(data.id);
		console.log(data.price);
		console.log(data.title);
		

		msg.ack()
	}
}
