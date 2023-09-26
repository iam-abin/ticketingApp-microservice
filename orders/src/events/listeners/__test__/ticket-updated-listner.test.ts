import { TicketUpdatedListner } from "../ticket-updated-listner"; 
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@abitickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async ()=>{
    // Create an instance of the listner
    const listner = new TicketUpdatedListner(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })
    await ticket.save();

    // Create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version+1,
        title: 'new concert',
        price: 999,
        userId: 'ajsfjs'
    }
    // Create a fake message object
    // The following 'ts-ignore' method is used to not show errors by ts even if we don't
    //  implement the message correctly
    // @ts-ignore 
    const msg: Message = {
        ack: jest.fn()
    }

    // return all of this stuff
    return { listner, ticket, data, msg }
}

it("finds, updates and saves a ticket", async() => {
    const { listner, ticket, data, msg } = await setup();

    // Call the onMessage fn with the data object + message object
    await listner.onMessage(data, msg);

    // Write assertions to make sure a ticket was created!
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title)
    expect(updatedTicket?.price).toEqual(data.price)
    expect(updatedTicket?.version).toEqual(data.version)
});

it("acks the message", async() => {
    const { listner, data, msg } = await setup();

    // Call the onMessage fn with the data object + message object
    await listner.onMessage(data, msg);

    // Write assertions to make sure ack fn is called!
    expect(msg.ack).toHaveBeenCalled()
});

it('does not call ack if the event has a skipped version number', async()=>{
    const { listner, data, msg } = await setup();
    data.version = 10

    // Call the onMessage fn with the data object + message object
    try {
        await listner.onMessage(data, msg);
    } catch (error) {
        
    }

     // Write assertions to make sure ack fn is not called!
     expect(msg.ack).not.toHaveBeenCalled()
})