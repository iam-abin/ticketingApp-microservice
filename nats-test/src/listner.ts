import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const clientid = randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", clientid, {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("Listner connected to NATS");

	stan.on("close", () => {
		console.log("NATS connection closed!");
		process.exit();
	});

	// subscribing to channel 'ticket:created'
	// 'order-service-queue-group' que group is used to make sure that multiple instance of the same service not all going to
	// receive the exact same events .it make sure that we dont try to do more than one processing on the same incomming event
	const options = stan.subscriptionOptions()
	.setManualAckMode(true)
	.setDeliverAllAvailable()
	.setDurableName('acounting-service')

	const subscription = stan.subscribe(
		"ticket:created",
		"order-service-queue-group",
		options
	);

	subscription.on("message", (msg: Message) => {
		const data = msg.getData();

		if (typeof data === "string") {
			console.log(
				`Received event #${msg.getSequence()}, with data: ${data}`
			);
		}
		msg.ack();
	});
});

process.on("SIGINT", () => stan.close()); //sent to a process by the operating system to interrupt its normal execution
process.on("SIGTERM", () => stan.close()); // generic termination signal used to cause a process to exit.
