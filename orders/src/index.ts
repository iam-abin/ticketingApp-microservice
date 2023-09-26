import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListner } from "./events/listeners/ticket-updated-listner";

const start = async () => {
	// env variables are set in deployment.yalm files
	//if we do not set jwt_key
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}

	//if we do not set mongo_uri
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

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

		// it is used to listen to incomming events
		new TicketCreatedListener(natsWrapper.client).listen()
		new TicketUpdatedListner(natsWrapper.client).listen()

		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to mongodb");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("orders Listening on port 3000....");
	});
};

start();
