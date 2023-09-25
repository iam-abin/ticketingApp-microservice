import { Publisher, Subjects, TicketUpdatedEvent } from "@abitickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
     
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated ;

}