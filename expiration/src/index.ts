import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error("NATS_CLIENT_ID must be defined");
	}
	if (!process.env.NATS_URL) {
		throw new Error("NATS_URL must be defined");
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error("NATS_CLUSTER_ID must be defined");
	}

	try {
		// to connect to NATS
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);
		natsWrapper.client.on("close", () => {
			console.log("NATS connection closed!");
			process.exit();
		});

		process.on("SIGINT", () => natsWrapper.client.close()); //sent to a process by the operating system to interrupt its normal execution
		process.on("SIGTERM", () => natsWrapper.client.close()); // generic termination signal used to cause a process to exit.
		
		// this objects is used to listen to incomming events
		new OrderCreatedListener(natsWrapper.client).listen();
	} catch (err) {
		console.error(err);
	}
};

start();
