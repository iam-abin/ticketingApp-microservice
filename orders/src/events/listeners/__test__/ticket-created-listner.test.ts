import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@abitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async ()=>{
    // Create an instance of the listner
    const listner = new TicketCreatedListener(natsWrapper.client);

    // Create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    
    // Create a fake message object
    // The following 'ts-ignore' method is used to not show errors by ts even if we don't
    //  implement the message correctly
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn()
    }

    // return all of this stuff
    return { listner, data, msg }
}

it("create and save a ticket", async() => {
    const { listner, data, msg } = await setup();

    // Call the onMessage fn with the data object + message object
    await listner.onMessage(data, msg);

    // Write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined()
    expect(ticket?.title).toEqual(data.title)
    expect(ticket?.price).toEqual(data.price)
});

it("acks the message", async() => {
    const { listner, data, msg } = await setup();

    // Call the onMessage fn with the data object + message object
    await listner.onMessage(data, msg);

    // Write assertions to make sure ack fn is called!
    expect(msg.ack).toHaveBeenCalled()
});
