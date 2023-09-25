import { Publisher, Subjects, OrderCreatedEvent } from "@abitickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
     
    subject: Subjects.OrderCreated = Subjects.OrderCreated ;

}