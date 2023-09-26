import {
	Publisher,
	Subjects,
	ExpirationCompleteEvent,
} from "@abitickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
