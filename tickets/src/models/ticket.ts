import mongoose from "mongoose";

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
	// createdAt: string
}

//interface describes properties  an overall model or collection has
interface TicketModel extends mongoose.Model<TicketDocument> {
	// build method is used to make validation or type checking on arguments used to create ticket document
	build(attributes: TicketAttributes): TicketDocument;
}

const ticketSchema = new mongoose.Schema({
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
},{
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
});


ticketSchema.statics.build = (attributes: TicketAttributes)=>{
    return new Ticket(attributes)
}

const Ticket = mongoose.model<TicketDocument,TicketModel>('Ticket',ticketSchema)

export {Ticket}