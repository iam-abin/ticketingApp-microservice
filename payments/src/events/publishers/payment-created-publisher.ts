import { Publisher, Subjects, PaymentCreatedEvent } from "@abitickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated =Subjects.PaymentCreated;

}