import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current"; // Optimistic concurrency control plugin solves concurrency issue

// interface describes properties used to create a ticket
interface TicketAttributes {
	title: string;
	price: number;
	userId: string;
}

//interface describes properties  a saved ticket document has
interface TicketDocument extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId?: string;  // '?' means optional
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
		},
		userId: {
			type: String,
			required: true,
		},
		orderId:{ // it helps to determine whether ticket is locked or not
			type: String
		}
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
// change '__v' to 'version'
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin); // to update the version of a document

ticketSchema.statics.build = (attributes: TicketAttributes) => {
	return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
	"Ticket",
	ticketSchema
);

export { Ticket };
