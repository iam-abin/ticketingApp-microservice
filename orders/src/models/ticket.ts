import mongoose from "mongoose";

import { Order, OrderStatus } from "../models/order";

// interface describes properties used to create a ticket
interface TicketAttributes {
	id: string;
	title: string;
	price: number;
}

//interface describes properties  a saved ticket document has
export interface TicketDocument extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
	// createdAt: string
}

//interface describes properties  an overall model or collection has
interface TicketModel extends mongoose.Model<TicketDocument> {
	// build method is used to make validation or type checking on arguments used to create ticket document
	build(attributes: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

// 'statics' to directly add a new method to ticket model
ticketSchema.statics.build = (attributes: TicketAttributes) => {
	return new Ticket({
		_id: attributes.id,
		title: attributes.title,
		price: attributes.price,
	});
};

// 'method' is add a new method to a document
ticketSchema.methods.isReserved = async function () {
	// in this function 'this' keyword represent ticket document that we just called 'isReserved' on

	// Run query to look at all orders. Find an order where the ticket
	// is the ticket we just found *and* the orders status is *not* cancelled.
	// if we find an order from that it means the ticket *is* reserved
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});

	// if 'existingOrder' contains value then, !existingOrder gives 'false' then again. !false gives 'true'
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
	"Ticket",
	ticketSchema
);

export { Ticket };
