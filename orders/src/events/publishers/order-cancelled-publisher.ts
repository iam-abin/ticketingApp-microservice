import { Publisher, Subjects, OrderCancelledEvent } from "@abitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
     
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled ;

}