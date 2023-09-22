import nats from "node-nats-streaming";

console.clear()

const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

stan.on("connect", () => {
	console.log("publisher connected to NATS");

	const data = JSON.stringify({
		id: "123",
		title: "concert",
		price: 20,
	});

    // creating channel 'ticket:created' and publishing data to channel 'ticket:created'
	stan.publish("ticket:created", data, () => {
		console.log("Event published");
	});
});
