import { Subjects } from "./subjects";

// interface or structure for event that indicate that a ticket was just created
export interface TicketCreatedEvent {
	subject: Subjects.TicketCreated;
	data: {
		id: string;
		title: string;
		price: number;
	};
}
