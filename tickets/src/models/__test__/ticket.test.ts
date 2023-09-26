import { Ticket } from "../ticket";

it("implements optimistic cuncurrency control", async () => {
	// Create an instance of a ticket
	const ticket = Ticket.build({
		title: "concert",
		price: 5,
		userId: "123",
	});

	// Save the ticket to the database
	await ticket.save();

	// Fetch the ticket twice
	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	// Make two seperate changes to the ticket we fetcched
	firstInstance?.set({ price: 10 });
	secondInstance?.set({ price: 15 });

	// Save the first fetched ticket
	await firstInstance?.save();

	// Save the second fetched ticket and expect an error
	try {
		await secondInstance?.save();
	} catch (error) {
		return;
	}
	// if error occut line 32 won't work due to return in catch as error occured
	throw new Error("should not reach this point");
});

it('incremet the version number on every single time we save the ticket to db', async()=>{
    const ticket = Ticket.build({
		title: "concert",
		price: 20,
		userId: "123",
	});

    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();
    expect(ticket.version).toEqual(1)
    await ticket.save();
    expect(ticket.version).toEqual(2)
})