import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "kkkkk",
			price: 20,
		})
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "kkkkk",
			price: 20,
		})
		.expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signin())
		.send({
			title: "kkkkk",
			price: 20,
		});

	// updating a ticket
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "pppppp",
			price: 40,
		})
		.expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin(); // to use same user over multiple request

	// creating a ticket
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "kkkkk",
			price: 20,
		});

	// updating a ticket with invalid title
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "ggggg",
			price: -10,
		})
		.expect(400);
});

it("update the ticket with provided valid inputs", async () => {
	const cookie = global.signin();

	// creating a ticket
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "kkkkk",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

    expect(ticketResponse.body.title).toEqual('new title')
    expect(ticketResponse.body.price).toEqual(100)

});


it("publishes an event", async () => {
	const cookie = global.signin();

	// creating a ticket
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "kkkkk",
			price: 20,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
	
});

it("rejects updates if the ticket is reserved", async () => {
	const cookie = global.signin(); // to use same user over multiple request

	// creating a ticket
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "kkkkk",
			price: 20,
		});
	
		const ticket = await Ticket.findById(response.body.id);
		ticket?.set({orderId: new mongoose.Types.ObjectId().toHexString()});
		await ticket?.save();

	// updating a ticket with invalid title
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 200,
		})
		.expect(400);

});