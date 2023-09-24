import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listner";

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

	new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close()); //sent to a process by the operating system to interrupt its normal execution
process.on("SIGTERM", () => stan.close()); // generic termination signal used to cause a process to exit.