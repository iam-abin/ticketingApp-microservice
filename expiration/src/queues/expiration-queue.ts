import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper"; // we need to provide nats client every time we publish an event

interface Payload {
	orderId: string;
}

// 'order:expiration' is a bucket name were we store our 'job' temporarly
// second arg is to connect this queue to redis server
const expirationQueue = new Queue<Payload>("order:expiration", {
	redis: {
		host: process.env.REDIS_HOST,
	},
});

expirationQueue.process(async (job) => {
	// async means it will return a promise
	// eg:- it will be complete process after 15 mins
	
	new ExpirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId
	})
});

export { expirationQueue };
