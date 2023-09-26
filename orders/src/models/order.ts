import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@abitickets/common";

import { TicketDocument } from "./ticket";

export { OrderStatus }

// interface describes properties used to create an order
interface OrderAttributes {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDocument;
}

//interface describes properties  a saved order document has
interface OrderDocument extends mongoose.Document {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDocument;
	version: number;
	// createdAt: string
}

//interface describes properties  an overall model or collection has
interface OrdertModel extends mongoose.Model<OrderDocument> {
	// build method is used to make validation or type checking on arguments used to create order document
	build(attributes: OrderAttributes): OrderDocument;
}

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
		},
		expiresAt: {
			type: mongoose.Schema.Types.Date,
			// we dont need to expire order after order placement, so 'required' field not needed
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Ticket",
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

OrderSchema.set('versionKey','version')
OrderSchema.plugin(updateIfCurrentPlugin) // to update the version of a document

OrderSchema.statics.build = (attributes: OrderAttributes) => {
	return new Order(attributes);
};

const Order = mongoose.model<OrderDocument, OrdertModel>(
	"Order",
	OrderSchema
);

export { Order };