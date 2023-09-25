import { Publisher, Subjects, TicketCreatedEvent } from "@abitickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
     
    subject: Subjects.TicketCreated = Subjects.TicketCreated ;

}